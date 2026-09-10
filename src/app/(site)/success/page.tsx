import type { Metadata } from "next";
import Link from "next/link";
import { stripe } from "@/lib/stripe";
import { formatPrice } from "@/lib/format";
import { ClearCartOnMount } from "@/components/clear-cart-on-mount";

export const metadata: Metadata = {
  title: "Order confirmed",
  robots: { index: false },
};

export default async function SuccessPage({
  searchParams,
}: PageProps<"/success">) {
  const params = await searchParams;
  const sessionId =
    typeof params.session_id === "string" ? params.session_id : undefined;

  let amount: number | null = null;
  let email: string | null = null;
  if (sessionId && stripe) {
    try {
      const session = await stripe.checkout.sessions.retrieve(sessionId);
      amount = session.amount_total != null ? session.amount_total / 100 : null;
      email = session.customer_details?.email ?? null;
    } catch {
      /* stale or invalid session id — still show a generic confirmation */
    }
  }

  return (
    <div className="mx-auto max-w-xl px-4 py-24 text-center sm:px-6">
      <ClearCartOnMount />
      <p className="eyebrow">Thank you</p>
      <h1 className="mt-3 font-display text-4xl">Your order is confirmed</h1>
      <p className="mt-4 text-muted">
        {email
          ? `We've sent a confirmation to ${email}.`
          : "We've emailed you a confirmation."}{" "}
        Each piece is checked, photographed and packed by hand — we&apos;ll be in
        touch within one business day about delivery.
      </p>

      {amount != null && (
        <p className="mt-6 font-display text-2xl">
          Total paid: {formatPrice(amount)}
        </p>
      )}

      <Link
        href="/shop"
        className="mt-10 inline-block rounded-full border border-border px-6 py-3 text-sm transition-colors hover:border-accent"
      >
        Continue browsing
      </Link>
    </div>
  );
}
