import type { Metadata } from "next";
import { DiamondMark } from "@/components/logo";
import { Reveal } from "@/components/reveal";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Terms of Sale",
  description: "The terms behind every purchase, in plain language.",
};

export default function TermsPage() {
  return (
    <div className="relative mx-auto max-w-2xl overflow-hidden px-4 py-16 sm:px-6">
      <DiamondMark className="pointer-events-none absolute -right-16 -top-10 h-56 w-56 text-accent/10" />

      <Reveal>
        <p className="eyebrow">Terms of Sale</p>
        <h1 className="mt-2 font-display text-4xl">
          How buying works, in writing
        </h1>
        <p className="mt-4 max-w-xl text-sm text-muted">
          A plain-language summary of the terms behind every purchase from{" "}
          {SITE.name}. It describes how the site actually works rather than
          standing in for formal legal terms — worth having reviewed by a
          professional before relying on it.
        </p>
      </Reveal>

      <Reveal delay={70} as="div" className="mt-10 space-y-8 text-sm leading-relaxed text-muted">
        <section>
          <h2 className="font-display text-lg text-foreground">
            One of a kind
          </h2>
          <p className="mt-2">
            Every piece listed is unique. Reserving a piece through Stripe
            checkout holds it for you while payment is confirmed. Once
            payment clears, the sale is final.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-foreground">Pricing</h2>
          <p className="mt-2">
            Prices shown are all-inclusive in {SITE.currency}, unless stated
            otherwise, and may change at any time before you reserve a
            piece.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-foreground">
            Making an offer
          </h2>
          <p className="mt-2">
            Submitting an offer through the &ldquo;Make an offer&rdquo; form
            is the start of a conversation, not a binding purchase — a sale
            is only final once you complete checkout, or we agree on a
            price and confirm it directly.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-foreground">Payment</h2>
          <p className="mt-2">
            Payment is processed securely by Stripe. We never see or store
            your card details.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-foreground">
            Certification
          </h2>
          <p className="mt-2">
            Diamonds are independently graded by GIA or IGI and ship with
            their original certificate. We stand behind the grading on
            that certificate.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-foreground">Delivery</h2>
          <p className="mt-2">
            Delivery is insured and tracked. You&apos;re also welcome to
            collect in person by appointment.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-foreground">Returns</h2>
          <p className="mt-2">
            Because every piece is one of a kind and personally sourced,
            returns are handled case by case rather than under a blanket
            policy — get in touch and we&apos;ll work it out together.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-foreground">
            Bespoke and made-to-order pieces
          </h2>
          <p className="mt-2">
            Commissioned pieces are made to your specification. Timelines
            vary by piece and are confirmed with you before you commit.
          </p>
        </section>
      </Reveal>
    </div>
  );
}
