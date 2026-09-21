import { NextResponse } from "next/server";
import { revalidateTag } from "next/cache";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { resend, resendConfigured, RESEND_FROM } from "@/lib/resend";
import { SITE } from "@/lib/site";
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
          const sold = result?.sold.find((s) => s.id === id);
          const clash = result?.conflicts.find((c) => c.id === id);
          const label = sold?.name ?? clash?.name ?? id;
          return `- ${label}${clash ? "  (ALREADY SOLD - refund needed)" : ""}`;
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

      await resend.emails.send({
        from: RESEND_FROM,
        to: SITE.email,
        ...(buyer?.email ? { replyTo: buyer.email } : {}),
        subject: conflict ? "ACTION NEEDED: paid for an already-sold piece" : "New order paid",
        text: lines.join("\n"),
      });
    }
  } catch (err) {
    console.error("[webhook] failed to process payment:", err);
    // 500 makes Stripe retry, and markSold is safe to run again.
    return NextResponse.json({ error: "Processing failed" }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
