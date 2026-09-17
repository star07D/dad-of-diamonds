import type { Metadata } from "next";
import Link from "next/link";
import { DiamondMark } from "@/components/logo";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "FAQ",
  description:
    "Answers to common questions about certification, reserving a piece, delivery, resizing, and more.",
};

const FAQS = [
  {
    q: "Are your diamonds certified?",
    a: "Yes — every diamond is independently graded by GIA or IGI and ships with its original certificate and laser inscription.",
  },
  {
    q: "How does reserving a piece work?",
    a: "Reserve online through Stripe checkout. Because every piece is one of a kind, reserving holds it for you while payment is confirmed — nobody else can buy it in the meantime.",
  },
  {
    q: "Can I negotiate the price?",
    a: 'Yes. Every product page has a "Make an offer" link that opens a short form pre-filled with the piece — send a number and you’ll hear back.',
  },
  {
    q: "Is delivery insured?",
    a: "Yes, delivery is insured and tracked. You're also welcome to collect in person by appointment.",
  },
  {
    q: "Do you ship internationally, and what does it cost?",
    a: "Tell us where you're based when you reserve or enquire and we'll confirm the exact shipping cost and timeline for your location before anything is charged.",
  },
  {
    q: "Do you make bespoke or made-to-order pieces?",
    a: "Yes — choose a loose stone and have it set, or commission a piece from a sketch. Get in touch with your idea and we'll take it from there.",
  },
  {
    q: "Can a ring be resized?",
    a: "It depends on the piece — some are made to order and can be sized from the start, others may allow resizing after. Check the product description or ask before you buy and we'll confirm.",
  },
  {
    q: "What's your returns policy?",
    a: "Every piece is one of a kind and personally sourced, so returns are handled case by case rather than a blanket policy — reach out and we'll sort it out together.",
  },
  {
    q: "How quickly will I hear back?",
    a: "Within one business day, usually sooner. WhatsApp is fastest.",
  },
];

export default function FaqPage() {
  return (
    <div className="relative mx-auto max-w-2xl overflow-hidden px-4 py-16 sm:px-6">
      <DiamondMark className="pointer-events-none absolute -right-16 -top-10 h-56 w-56 text-accent/10" />

      <Reveal>
        <p className="eyebrow">FAQ</p>
        <h1 className="mt-2 font-display text-4xl">Common questions</h1>
        <p className="mt-4 max-w-xl text-muted">
          Can&apos;t find what you&apos;re after?{" "}
          <Link href="/contact" className="text-accent underline underline-offset-4">
            Just ask
          </Link>
          .
        </p>
      </Reveal>

      <div className="mt-10 space-y-3">
        {FAQS.map((item, i) => (
          <Reveal key={item.q} delay={i * 40}>
            <details className="group rounded-lg border border-border bg-surface-muted px-5 py-4 open:pb-5">
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-display text-lg [&::-webkit-details-marker]:hidden">
                {item.q}
                <span className="shrink-0 text-muted transition-transform duration-200 group-open:rotate-45">
                  <svg
                    viewBox="0 0 24 24"
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={1.8}
                    strokeLinecap="round"
                  >
                    <path d="M12 5v14M5 12h14" />
                  </svg>
                </span>
              </summary>
              <p className="mt-3 text-sm leading-relaxed text-muted">{item.a}</p>
            </details>
          </Reveal>
        ))}
      </div>

      <Reveal delay={FAQS.length * 40 + 40}>
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
