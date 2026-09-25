import type { Metadata } from "next";
import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import {
  QUIZ_KEYS,
  answerLabel,
  isComplete,
  parseAnswers,
  recommend,
} from "@/lib/quiz";
import { ProductCard } from "@/components/product-card";
import { QuizFlow } from "@/components/quiz-flow";
import { DiamondMark } from "@/components/logo";
import { Reveal } from "@/components/reveal";
import { SITE } from "@/lib/site";

export async function generateMetadata({
  searchParams,
}: PageProps<"/find">): Promise<Metadata> {
  const answered = isComplete(parseAnswers(await searchParams));
  return {
    title: answered ? "Your shortlist" : "Help me choose",
    description:
      "Answer four quick questions and we'll suggest pieces from the collection that fit.",
    // A personal result, not something to surface in search results.
    robots: answered ? { index: false } : undefined,
  };
}

export default async function FindPage({ searchParams }: PageProps<"/find">) {
  const answers = parseAnswers(await searchParams);

  if (!isComplete(answers)) {
    return (
      <div className="relative mx-auto max-w-3xl overflow-hidden px-4 py-16 sm:px-6">
        <DiamondMark className="pointer-events-none absolute -right-16 -top-10 h-56 w-56 text-accent/10" />
        <Reveal>
          <p className="eyebrow">Help me choose</p>
          <h1 className="mt-2 font-display text-4xl">Let&apos;s find your piece</h1>
          <p className="mt-4 max-w-xl text-muted">
            Four quick questions, no sign-up. We&apos;ll suggest pieces from the
            collection that fit — and tell you why.
          </p>
        </Reveal>
        <div className="mt-10">
          <QuizFlow />
        </div>
      </div>
    );
  }

  const { matches, relaxed } = recommend(await getAllProducts(), answers);

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <Reveal>
        <p className="eyebrow">Your shortlist</p>
        <h1 className="mt-2 font-display text-4xl">
          {matches.length > 0 ? "Here's what we'd show you" : "Nothing quite fits yet"}
        </h1>
        <div className="mt-4 flex flex-wrap gap-2">
          {QUIZ_KEYS.map((k) => (
            <span
              key={k}
              className="rounded-full border border-border px-3 py-1 text-xs text-muted"
            >
              {answerLabel(k, answers[k])}
            </span>
          ))}
        </div>
        {relaxed && matches.length > 0 && (
          <p className="mt-4 max-w-xl text-sm text-muted">
            Nothing is priced inside that budget right now, so these are the
            closest pieces. Prices are shown on each card.
          </p>
        )}
        <h2 className="sr-only">Suggested pieces</h2>
      </Reveal>

      {matches.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <DiamondMark className="h-8 w-8 text-accent/60" />
          <p className="mt-4 max-w-md text-muted">
            We don&apos;t have anything available in that category at the
            moment. Tell us what you&apos;re after — we can often source it.
          </p>
          <Link
            href="/contact"
            className="mt-6 inline-block rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-contrast shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-95 hover:shadow-md active:translate-y-0"
          >
            Ask us to find it
          </Link>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {matches.map(({ product, reasons }, i) => (
            <Reveal key={product.id} delay={(i % 3) * 70}>
              <ProductCard product={product} priority={i < 3} />
              {reasons.length > 0 && (
                <ul className="mt-3 space-y-1 text-sm text-muted">
                  {reasons.map((r) => (
                    <li key={r} className="flex gap-2">
                      <span aria-hidden className="text-accent">
                        ◆
                      </span>
                      {r}
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          ))}
        </div>
      )}

      <Reveal className="mt-12 flex flex-wrap items-center gap-3">
        <Link
          href="/find"
          className="inline-block rounded-full border border-border px-6 py-3 text-sm transition-all hover:-translate-y-0.5 hover:border-accent active:translate-y-0"
        >
          Start over
        </Link>
        <Link
          href="/shop"
          className="inline-block rounded-full border border-border px-6 py-3 text-sm transition-all hover:-translate-y-0.5 hover:border-accent active:translate-y-0"
        >
          Browse everything
        </Link>
        <a
          href={SITE.whatsapp}
          target="_blank"
          rel="noreferrer"
          className="text-sm text-muted underline underline-offset-4 transition-colors hover:text-accent"
        >
          Or ask us on WhatsApp
        </a>
      </Reveal>
    </div>
  );
}
