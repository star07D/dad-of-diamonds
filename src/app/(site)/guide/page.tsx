import type { Metadata } from "next";
import Link from "next/link";
import { DiamondMark } from "@/components/logo";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "Understanding the 4 Cs",
  description:
    "A plain-English guide to carat, cut, colour and clarity — what actually matters when choosing a diamond.",
};

const CS = [
  {
    title: "Carat",
    body: "A unit of weight, not size — 0.2 grams per carat. Two stones of the same carat weight can look different sizes depending on how they're cut, so weight alone doesn't tell you how big a diamond looks on the hand.",
  },
  {
    title: "Cut",
    body: "How well a stone's proportions and facets are cut — this is what actually controls sparkle. A well-cut diamond returns more light to the eye, so cut affects brilliance more than colour or clarity do.",
  },
  {
    title: "Colour",
    body: "Graded D (colourless) to Z (noticeably tinted) on the GIA scale. Most people can't tell the difference by eye past G–H, which is why near-colourless stones are usually the best value.",
  },
  {
    title: "Clarity",
    body: "Measures internal and surface inclusions, from Flawless down to I3. Most inclusions are microscopic — an \"eye-clean\" stone (typically VS–SI) looks perfect to the naked eye at a fraction of the price of Flawless.",
  },
];

export default function GuidePage() {
  return (
    <div className="relative mx-auto max-w-3xl overflow-hidden px-4 py-16 sm:px-6">
      <DiamondMark className="pointer-events-none absolute -right-16 -top-10 h-56 w-56 text-accent/10" />

      <Reveal>
        <p className="eyebrow">Diamond guide</p>
        <h1 className="mt-2 font-display text-4xl">Understanding the 4 Cs</h1>
        <p className="mt-4 max-w-xl text-muted">
          Carat, cut, colour and clarity are what a diamond&apos;s certificate
          grades — and what actually determines how a stone looks and what it
          costs. Here&apos;s what each one means in plain English.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {CS.map((c, i) => (
          <Reveal
            key={c.title}
            delay={i * 70}
            className="rounded-lg border border-border bg-surface-muted p-6"
          >
            <p className="eyebrow">{String(i + 1).padStart(2, "0")}</p>
            <h2 className="mt-2 font-display text-xl">{c.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-muted">{c.body}</p>
          </Reveal>
        ))}
      </div>

      <Reveal
        delay={280}
        className="mt-6 rounded-lg border border-border bg-surface-muted p-6"
      >
        <h2 className="font-display text-xl">Why certification matters</h2>
        <p className="mt-3 text-sm leading-relaxed text-muted">
          Every diamond here is independently graded by GIA or IGI, the two
          most trusted labs in the trade. The certificate is a second,
          impartial opinion on the 4 Cs above — so you&apos;re never just
          taking our word for it.
        </p>
      </Reveal>

      <Reveal delay={340}>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href="/shop"
            className="inline-block rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-contrast shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-95 hover:shadow-md active:translate-y-0"
          >
            Browse the collection
          </Link>
          <Link
            href="/contact"
            className="inline-block rounded-full border border-border px-6 py-3 text-sm transition-all hover:-translate-y-0.5 hover:border-accent active:translate-y-0"
          >
            Ask a question
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
