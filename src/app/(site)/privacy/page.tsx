import type { Metadata } from "next";
import { DiamondMark } from "@/components/logo";
import { Reveal } from "@/components/reveal";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "What Dad of Diamonds collects, why, and what stays only on your device.",
};

export default function PrivacyPage() {
  return (
    <div className="relative mx-auto max-w-2xl overflow-hidden px-4 py-16 sm:px-6">
      <DiamondMark className="pointer-events-none absolute -right-16 -top-10 h-56 w-56 text-accent/10" />

      <Reveal>
        <p className="eyebrow">Privacy Policy</p>
        <h1 className="mt-2 font-display text-4xl">
          How your information is handled
        </h1>
        <p className="mt-4 max-w-xl text-sm text-muted">
          This page explains, in plain terms, what {SITE.name} collects and
          why. It describes how the site actually works rather than standing
          in for formal legal advice — worth having reviewed by a
          professional for your situation before relying on it.
        </p>
      </Reveal>

      <Reveal delay={70} as="div" className="mt-10 space-y-8 text-sm leading-relaxed text-muted">
        <section>
          <h2 className="font-display text-lg text-foreground">
            What you send us directly
          </h2>
          <p className="mt-2">
            Using the contact form, &ldquo;Make an offer&rdquo;, or the
            cart&apos;s &ldquo;Send enquiry&rdquo; button sends us your name,
            email address, and message (including which piece, if any).
            This goes straight to our inbox by email — it isn&apos;t stored
            in a database.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-foreground">
            Newsletter signup
          </h2>
          <p className="mt-2">
            The &ldquo;new arrivals&rdquo; form in the footer collects only
            your email address, sent to us the same way.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-foreground">
            What stays on your device
          </h2>
          <p className="mt-2">
            Your cart, wishlist, comparison list, and recently viewed pieces
            are all stored only in your browser&apos;s local storage. None
            of this is sent to us or visible to us — it stays on your
            device until you clear your browser data.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-foreground">Payment</h2>
          <p className="mt-2">
            Payments are processed by Stripe on Stripe&apos;s own secure
            checkout page. We never see or store your card details. As part
            of completing an order, Stripe collects your billing address,
            shipping address, and phone number directly — see Stripe&apos;s
            own privacy policy for how they handle that.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-foreground">Analytics</h2>
          <p className="mt-2">
            We use Vercel Web Analytics, which is cookie-free and reports
            only aggregate page-view statistics — it doesn&apos;t track you
            individually or across other sites.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-foreground">
            Who else sees this
          </h2>
          <p className="mt-2">
            Enquiries and signups are sent through Resend, our email
            provider. Payments, once enabled, are handled by Stripe. The
            site is hosted on Vercel, and the product catalogue may be
            managed through Sanity. None of these providers use your
            information for their own marketing.
          </p>
        </section>

        <section>
          <h2 className="font-display text-lg text-foreground">
            Your options
          </h2>
          <p className="mt-2">
            Since almost everything here lives in your own browser or a
            single inbox rather than a database, most requests are simple —
            email{" "}
            <a
              href={`mailto:${SITE.email}`}
              className="text-accent underline underline-offset-4"
            >
              {SITE.email}
            </a>{" "}
            to ask what we hold about you or to have it deleted.
          </p>
        </section>
      </Reveal>
    </div>
  );
}
