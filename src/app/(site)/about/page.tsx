import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";

export const metadata: Metadata = {
  title: "About",
  description:
    "Dad of Diamonds is a small, personally run collection of certified diamonds and fine jewellery.",
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 sm:px-6">
      <p className="eyebrow">About</p>
      <h1 className="mt-2 font-display text-4xl">A collection, not a showroom</h1>

      <div className="mt-8 space-y-5 text-muted">
        <p>
          {SITE.name} began the way most good things in this trade do — one
          person, a loupe, and years spent learning which stones are worth
          buying. What started as sourcing diamonds for family and friends became
          a small, carefully kept collection.
        </p>
        <p>
          Every diamond here is independently certified by GIA or IGI and comes
          with its paperwork and laser inscription. Finished jewellery is made to
          order in trusted workshops, so you can choose a loose stone and have it
          set exactly how you want it.
        </p>
        <p>
          Because there&apos;s no showroom and no middlemen, prices are lower than
          the high street for the same quality. And because it&apos;s one
          person&apos;s collection, you&apos;re always speaking to someone who has
          actually held the stone.
        </p>
      </div>

      <div className="mt-10 rounded-lg border border-border bg-surface-muted p-6">
        <h2 className="font-display text-xl">How buying works</h2>
        <ol className="mt-4 space-y-3 text-sm text-muted">
          <li>
            <span className="font-medium text-foreground">1. Browse or ask.</span>{" "}
            Reserve a piece online, or tell us what you&apos;re after and we&apos;ll
            send options with photos and certificates.
          </li>
          <li>
            <span className="font-medium text-foreground">2. Reserve.</span> A
            reservation holds the piece while payment is confirmed through Stripe.
          </li>
          <li>
            <span className="font-medium text-foreground">3. Receive.</span>{" "}
            Insured, tracked delivery — or collect in person by appointment.
          </li>
        </ol>
      </div>

      <p className="mt-10">
        <Link
          href="/contact"
          className="inline-block rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-contrast"
        >
          Start a conversation
        </Link>
      </p>
    </div>
  );
}
