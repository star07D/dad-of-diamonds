import type { Post } from "./types";

/**
 * Placeholder journal posts so /journal is browsable before the CMS is
 * connected. Replace with real posts in Sanity (see README → "Connect the
 * CMS"). General buying-guide content, same spirit as the FAQ and 4 Cs
 * guide — nothing here is specific to this business.
 */
export const SAMPLE_POSTS: Post[] = [
  {
    id: "post-engagement-ring-budget",
    slug: "engagement-ring-on-any-budget",
    title: "An engagement ring on any budget",
    excerpt:
      "The 4 Cs matter, but where you spend on them changes the look of a ring far more than the total price does.",
    publishedAt: "2026-08-03",
    body: `There's no "correct" amount to spend on an engagement ring — the old rule of a set number of months' salary was a marketing line, not a guideline worth following. What actually matters is deciding, before you start looking, which of the 4 Cs you care about most, because that's what determines how a ring looks far more than the total price does.

Carat weight is usually the first thing people fix on, but it's often the most expensive lever to pull. Prices don't rise in a straight line with carat — they jump sharply at round numbers like 1.00ct or 2.00ct, because more people search for exactly those weights. A stone at 0.90ct can look almost identical to a 1.00ct side by side, for meaningfully less money.

Cut is the one C that's worth prioritising on almost any budget. A well-cut stone returns more light to the eye, so it reads as brighter and more lively than a larger, poorly-cut stone of the same carat weight. If you only optimise one thing, optimise this.

Colour and clarity are where the real savings tend to hide. Most people can't tell the difference between a D and a G colour diamond without a loupe and a trained eye, and most inclusions at VS and SI clarity are invisible without magnification. Going a few grades down on either — while keeping cut high — is usually the single best way to get a bigger-looking, brighter stone for less.

Finally, consider a loose stone set into a simpler band rather than a heavily set, elaborate design. Setting complexity and metal weight add cost that has nothing to do with the diamond itself, and a simple setting also shows off a well-cut stone better than a busy one does.`,
  },
  {
    id: "post-loose-vs-ring",
    slug: "loose-diamond-or-a-finished-ring",
    title: "Loose diamond or a finished ring?",
    excerpt:
      "Buying the stone and the setting separately gives you more control — but it isn't the right choice for everyone.",
    publishedAt: "2026-08-24",
    body: `Buying a loose diamond and having it set is a different experience to buying a finished ring, and neither is the "better" option — they suit different priorities.

The case for buying loose: you choose the stone entirely on its own merits, comparing certificates and cut quality without a setting distracting the eye. You can then match it to any setting style, in any metal, at any point — including changing the setting later without touching the stone. This is usually the better route if you already know roughly what cut, colour and clarity you want, or if resizing or restyling down the line matters to you.

The case for a finished ring: it's simpler. Someone has already paired a stone with a setting that suits it, so there's less to evaluate and less that can go wrong. It also tends to be the faster option when there's a deadline — a proposal date, an anniversary — since there's no separate setting step to wait on.

A middle ground worth knowing about: buying loose and having it set doesn't have to mean designing something from scratch. Many jewellers, including a one-person operation like this, can set a chosen stone into a simple, proven setting style quickly, which gets you most of the control of buying loose with close to the convenience of a finished ring.

Whichever route you take, ask for the certificate before you commit to anything — a GIA or IGI report is the one document that lets you compare stones on equal terms, independent of how a listing describes them.`,
  },
  {
    id: "post-caring-for-jewellery",
    slug: "caring-for-your-jewellery-at-home",
    title: "Caring for your jewellery at home",
    excerpt:
      "Simple habits that keep stones bright and settings secure between professional cleanings.",
    publishedAt: "2026-09-14",
    body: `Fine jewellery doesn't need much maintenance, but a few habits make a noticeable difference to how a piece looks and holds up over the years.

Take rings off for anything that puts them under strain or in contact with chemicals — gardening, washing dishes, applying lotion or sunscreen, and swimming in chlorinated water. Chlorine in particular can weaken some metal alloys over time, and lotions and soaps build up a film that dulls a stone's sparkle far faster than everyday wear does.

Clean stones regularly with warm water, a small amount of mild dish soap, and a soft-bristled brush — an old, soft toothbrush works well. Gently brush behind the stone as well as the visible face, since that's where residue collects and dulls the light. Rinse thoroughly and dry with a soft, lint-free cloth. Avoid ultrasonic cleaners at home unless you're certain of the stone type and setting — some stones and older or delicate settings aren't safe in one.

Store pieces separately rather than in a pile — diamonds are hard enough to scratch softer metals and other gemstones, including each other's settings. A lined box with separate compartments, or soft pouches, is enough.

Have prongs and settings checked periodically, roughly once a year for a ring worn daily. Prongs wear down gradually with normal wear, and a stone is far more likely to be lost from a worn prong than from a manufacturing fault. This is a quick, inexpensive check with any jeweller and it's the single best way to avoid losing a stone.

If you're ever unsure whether a cleaning method is safe for a specific piece, ask before trying it — it's always easier to prevent damage than to repair it.`,
  },
];
