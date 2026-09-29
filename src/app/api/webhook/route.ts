import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { resend, resendConfigured, RESEND_FROM } from "@/lib/resend";
import { SITE } from "@/lib/site";
import { getAllProducts } from "@/lib/products";
import { buildBuyerEmail } from "@/lib/order-email";
import { markSold, sanityWriteConfigured } from "@/sanity/lib/mark-sold";

const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

const HANDLED = new Set([
  "checkout.session.completed",
  "checkout.session.async_payment_succeeded",
]);

function addressLines(a?: Stripe.Address | null): string[] {
  if (!a) return [];
  return [
    a.line1,
    a.line2,
    [a.postal_code, a.city].filter(Boolean).join(" "),
    a.state,
    a.country,
  ].filter((x): x is string => Boolean(x));
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

type SendPayload = Parameters<NonNullable<typeof resend>["emails"]["send"]>[0];

/**
 * Sends one email with a couple of retries for transient failures.
 *
 * Once a piece is marked sold, a Stripe redelivery of the same event is
 * treated as a duplicate and short-circuits before either email is
 * attempted again — see the "duplicate" check below — so a webhook retry
 * can't recover a failed send. This is the only chance either email gets.
 */
async function sendEmailWithRetries(
  payload: SendPayload,
  attempts = 3,
): Promise<boolean> {
  let lastError: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      const { error } = await resend!.emails.send(payload);
      if (!error) return true;
      lastError = error;
    } catch (err) {
      lastError = err;
    }
    if (i < attempts - 1) await sleep(300 * (i + 1));
  }
  console.error(`[webhook] "${payload.subject}" to ${payload.to} failed after ${attempts} attempts:`, lastError);
  return false;
}

export async function POST(request: Request) {
  if (!stripe || !webhookSecret) {
    return NextResponse.json({ configured: false }, { status: 501 });
  }

  const signature = request.headers.get("stripe-signature");
  if (!signature) {
    return NextResponse.json({ error: "Missing signature" }, { status: 400 });
  }

  // The signature covers the exact bytes Stripe sent — read the raw text.
  const body = await request.text();
  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (!HANDLED.has(event.type)) return NextResponse.json({ received: true });

  const session = event.data.object as Stripe.Checkout.Session;
  if (session.payment_status !== "paid") {
    return NextResponse.json({ received: true });
  }

  const ids = (session.metadata?.product_ids ?? "").split(",").filter(Boolean);
  if (ids.length === 0) return NextResponse.json({ received: true });

  try {
    const result = sanityWriteConfigured
      ? await markSold(ids, session.id)
      : null;

    // A repeat delivery of an already-handled payment: nothing more to do.
    if (result && result.sold.length === 0 && result.conflicts.length === 0 &&
        result.missing.length === 0) {
      return NextResponse.json({ received: true, duplicate: true });
    }

    if (result && result.sold.length > 0) {
      // Webhook-driven, so expire immediately rather than serving stale pages.
      revalidateTag("product", { expire: 0 });
    }

    if (resendConfigured && resend) {
      const buyer = session.customer_details;
      const ship = session.collected_information?.shipping_details;
      const conflict = (result?.conflicts.length ?? 0) > 0;
      const total = session.amount_total != null
        ? `${(session.amount_total / 100).toLocaleString(SITE.locale)} ${session.currency?.toUpperCase()}`
        : "unknown";

      // Names for the emails. markSold only knows the pieces it just updated
      // (and nothing at all without the CMS token), so fall back to the
      // catalogue rather than showing a raw id.
      const names = new Map<string, string>();
      for (const s of result?.sold ?? []) names.set(s.id, s.name);
      for (const c of result?.conflicts ?? []) names.set(c.id, c.name);
      if (ids.some((id) => !names.has(id))) {
        try {
          for (const p of await getAllProducts()) {
            if (ids.includes(p.id) && !names.has(p.id)) names.set(p.id, p.name);
          }
        } catch {
          // Keep going — the ids still identify the pieces.
        }
      }

      const lines = [
        conflict
          ? "ACTION NEEDED: a payment came in for a piece that was already marked sold. Refund the extra payment in the Stripe dashboard."
          : "A payment was completed on the website.",
        "",
        `Total: ${total}`,
        `Stripe payment: ${session.id}`,
        "",
        "Pieces:",
        ...ids.map((id) => {
          const clash = result?.conflicts.find((c) => c.id === id);
          return `- ${names.get(id) ?? id}${clash ? "  (ALREADY SOLD - refund needed)" : ""}`;
        }),
        ...(result === null
          ? ["", "Note: the site can't update the CMS yet (SANITY_API_WRITE_TOKEN missing) - mark these as sold in the Studio yourself."]
          : []),
        ...(result && result.missing.length > 0
          ? ["", `Not found in the CMS: ${result.missing.join(", ")}`]
          : []),
        "",
        "Buyer:",
        `${buyer?.name ?? "-"}`,
        `${buyer?.email ?? "-"}`,
        `${buyer?.phone ?? "-"}`,
        "",
        "Ship to:",
        ...(addressLines(ship?.address ?? buyer?.address).length
          ? addressLines(ship?.address ?? buyer?.address)
          : ["-"]),
      ];

      // Best effort, but retried a few times — see sendEmailWithRetries.
      // This is a single person's shop, so a missed "New order paid" email
      // means a missed sale; failures are logged so they can be found in
      // Vercel's function logs and, if needed, the piece's Sold status in
      // the Studio checked to confirm the sale itself still went through.
      await sendEmailWithRetries({
        from: RESEND_FROM,
        to: SITE.email,
        ...(buyer?.email ? { replyTo: buyer.email } : {}),
        subject: conflict ? "ACTION NEEDED: paid for an already-sold piece" : "New order paid",
        text: lines.join("\n"),
      });

      // A receipt for the buyer — but never when the payment needs
      // refunding. (Until a sending domain is verified in Resend, mail to
      // anyone but the account owner is rejected, which lands here.)
      if (buyer?.email && !conflict && session.amount_total != null) {
        const { subject, text } = buildBuyerEmail({
          name: buyer.name,
          pieces: ids.map((id) => names.get(id) ?? "Your piece"),
          total,
          reference: session.id,
          shipTo: addressLines(ship?.address ?? buyer.address),
        });
        await sendEmailWithRetries({
          from: RESEND_FROM,
          to: buyer.email,
          replyTo: SITE.email,
          subject,
          text,
        });
      }
    }
  } catch (err) {
    console.error("[webhook] failed to process payment:", err);
    // 500 makes Stripe retry, and markSold is safe to run again.
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
