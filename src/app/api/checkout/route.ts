import { NextResponse } from "next/server";
import { getProductsByIds } from "@/lib/products";
import { stripe, stripeConfigured } from "@/lib/stripe";
import { SITE } from "@/lib/site";

export async function POST(request: Request) {
  let ids: string[] = [];
  try {
    const body = await request.json();
    if (Array.isArray(body?.ids)) {
      ids = body.ids.filter((x: unknown): x is string => typeof x === "string");
    }
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  if (ids.length === 0) {
    return NextResponse.json({ error: "Your cart is empty" }, { status: 400 });
  }

  // Never trust prices from the client — re-load from the source of truth.
  const products = await getProductsByIds(ids);
  const available = products.filter((p) => p.status === "available");

  if (available.length === 0) {
    return NextResponse.json(
      { error: "These pieces are no longer available" },
      { status: 409 },
    );
  }

  // Stripe not set up yet — tell the client to fall back to an enquiry.
  if (!stripeConfigured || !stripe) {
    return NextResponse.json({ configured: false });
  }

  const origin = request.headers.get("origin") ?? SITE.url;

  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    line_items: available.map((p) => ({
      quantity: 1,
      price_data: {
        currency: SITE.currency.toLowerCase(),
        unit_amount: Math.round(p.price * 100),
        product_data: {
          name: p.name,
          description: p.summary,
          metadata: { product_id: p.id, slug: p.slug },
        },
      },
    })),
    metadata: { product_ids: available.map((p) => p.id).join(",") },
    success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/cart`,
    billing_address_collection: "required",
    shipping_address_collection: {
      allowed_countries: [
        "DE", "US", "GB", "FR", "IT", "ES", "NL", "AT", "BE", "CH",
        "AE", "SG", "CA", "AU", "IN",
      ],
    },
    phone_number_collection: { enabled: true },
  });

  return NextResponse.json({ url: session.url });
}
