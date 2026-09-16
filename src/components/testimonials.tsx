import { Reveal } from "./reveal";

/**
 * Placeholder copy, deliberately bracketed so it reads as unfinished rather
 * than as a real review if it's ever seen before being swapped out. Replace
 * each entry with an actual client quote (WhatsApp/email, with permission)
 * before this section is relied on as genuine social proof.
 */
const TESTIMONIALS = [
  {
    quote:
      "[Add a short client quote here — how the buying process felt, the piece, delivery.]",
    name: "[Client name]",
    detail: "[e.g. Engagement ring, 2026]",
  },
  {
    quote: "[Add a second client quote here.]",
    name: "[Client name]",
    detail: "[e.g. Loose diamond, 2026]",
  },
  {
    quote: "[Add a third client quote here.]",
    name: "[Client name]",
    detail: "[e.g. Tennis bracelet, 2026]",
  },
];

export function Testimonials() {
  return (
    <section className="border-y border-border bg-surface-muted">
      <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6">
        <Reveal>
          <p className="eyebrow">What clients say</p>
          <h2 className="mt-2 font-display text-3xl">
            Trusted by people who&apos;ve bought before
          </h2>
        </Reveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t, i) => (
            <Reveal
              key={t.name + i}
              delay={i * 90}
              className="flex flex-col rounded-lg border border-border bg-surface p-6"
            >
              <p className="text-sm leading-relaxed text-muted">
                &ldquo;{t.quote}&rdquo;
              </p>
              <p className="mt-4 text-sm font-medium">{t.name}</p>
              <p className="text-xs text-muted">{t.detail}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
