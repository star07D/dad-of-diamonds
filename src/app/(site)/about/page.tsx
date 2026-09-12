import type { Metadata } from "next";
import Link from "next/link";
import { SITE } from "@/lib/site";
import { DiamondMark } from "@/components/logo";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "About",
  description:
    "Dad of Diamonds is a small, personally run collection of certified diamonds and fine jewellery.",
};

const STEPS = [
  {
    title: "Browse or ask",
    body: "Reserve a piece online, or tell us what you're after and we'll send options with photos and certificates.",
  },
  {
    title: "Reserve",
    body: "A reservation holds the piece while payment is confirmed through Stripe.",
  },
  {
    title: "Receive",
    body: "Insured, tracked delivery — or collect in person by appointment.",
  },
];

export default function AboutPage() {
  return (
    <div className="relative mx-auto max-w-2xl overflow-hidden px-4 py-16 sm:px-6">
      <DiamondMark className="pointer-events-none absolute -right-16 -top-10 h-56 w-56 text-accent/10" />

      <Reveal>
        <p className="eyebrow">About</p>
        <h1 className="mt-2 font-display text-4xl">A collection, not a showroom</h1>
      </Reveal>

      <Reveal delay={80} as="div" className="mt-8 space-y-5 text-muted">
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
      </Reveal>

      <Reveal
        delay={140}
        className="relative mt-10 rounded-lg border border-border bg-surface-muted p-6"
      >
        <h2 className="font-display text-xl">How buying works</h2>
        <ol className="mt-5 space-y-5 text-sm text-muted">
          {STEPS.map((step, i) => (
            <li key={step.title} className="flex gap-3.5">
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent text-xs font-medium text-accent-contrast">
                {i + 1}
              </span>
              <span>
                <span className="font-medium text-foreground">{step.title}.</span>{" "}
                {step.body}
              </span>
            </li>
          ))}
        </ol>
      </Reveal>

      <Reveal delay={200}>
        <p className="mt-10">
          <Link
            href="/contact"
            className="inline-block rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-contrast shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-95 hover:shadow-md active:translate-y-0"
          >
            Start a conversation
          </Link>
        </p>
      </Reveal>
    </div>
  );
}
