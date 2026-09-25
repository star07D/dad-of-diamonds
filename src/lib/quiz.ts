import type { Product } from "./types";
import { CATEGORIES } from "./site";
import { CLARITIES, COLOURS, PRICE_OPTIONS, parsePrice } from "./filters";

/* The "Help me choose" quiz. Pure and shared: the client flow reads the
 * questions, the server results page reads parseAnswers + recommend.
 * Nothing here is invented — every reason shown to a shopper is computed
 * from the piece's real data. */

export const ANY = "any";

export const QUIZ_KEYS = ["category", "budget", "look", "priority"] as const;
export type QuizKey = (typeof QUIZ_KEYS)[number];
export type QuizAnswers = Record<QuizKey, string>;

export interface QuizOption {
  value: string;
  label: string;
  hint?: string;
}

export interface QuizQuestion {
  key: QuizKey;
  title: string;
  help: string;
  options: QuizOption[];
}

export const QUIZ: QuizQuestion[] = [
  {
    key: "category",
    title: "What are you looking for?",
    help: "Pick the closest fit — you can always browse everything later.",
    options: [
      { value: "loose-diamonds", label: "A loose diamond", hint: "A stone to set yourself" },
      ...CATEGORIES.filter((c) => c.slug !== "loose-diamonds").map((c) => ({
        value: c.slug,
        label: c.label,
      })),
      { value: ANY, label: "Not sure yet", hint: "Show me the best of everything" },
    ],
  },
  {
    key: "budget",
    title: "What's a comfortable budget?",
    help: "Prices are all-in. If nothing fits exactly we'll show the closest.",
    options: [
      ...PRICE_OPTIONS.map((o) => ({ value: o.value, label: o.label })),
      { value: ANY, label: "I'm flexible" },
    ],
  },
  {
    key: "look",
    title: "Which look do you lean towards?",
    help: "This is about the shape of the stone.",
    options: [
      { value: "classic", label: "Classic and timeless", hint: "Round brilliant cuts" },
      { value: "modern", label: "Modern and distinctive", hint: "Oval, emerald, pear and other shapes" },
      { value: ANY, label: "No preference" },
    ],
  },
  {
    key: "priority",
    title: "What matters most to you?",
    help: "Not sure? The 4 Cs guide explains what each of these means.",
    options: [
      { value: "sparkle", label: "Maximum sparkle", hint: "An excellent cut" },
      { value: "value", label: "Best value", hint: "Near-colourless, eye-clean stones" },
      { value: "quality", label: "The highest grade", hint: "Top colour and clarity" },
      { value: ANY, label: "A bit of everything" },
    ],
  },
];

/** Reads answers from a query string, dropping anything that isn't a real option. */
export function parseAnswers(
  params: Record<string, string | string[] | undefined>,
): Partial<QuizAnswers> {
  const out: Partial<QuizAnswers> = {};
  for (const q of QUIZ) {
    const v = params[q.key];
    if (typeof v === "string" && q.options.some((o) => o.value === v)) {
      out[q.key] = v;
    }
  }
  return out;
}

export function isComplete(a: Partial<QuizAnswers>): a is QuizAnswers {
  return QUIZ_KEYS.every((k) => a[k] !== undefined);
}

export function resultsHref(a: QuizAnswers): string {
  return `/find?${new URLSearchParams(a).toString()}`;
}

/** The label of the option chosen for a question, e.g. for summary chips. */
export function answerLabel(key: QuizKey, value: string): string {
  const q = QUIZ.find((x) => x.key === key);
  return q?.options.find((o) => o.value === value)?.label ?? value;
}

export interface Match {
  product: Product;
  /** Plain-language reasons, each true of this piece. */
  reasons: string[];
}

export interface Recommendation {
  matches: Match[];
  /** True when nothing fit the budget and we're showing the nearest pieces. */
  relaxed: boolean;
}

const MAX_RESULTS = 6;

const rank = (list: string[], value?: string) =>
  list.indexOf((value ?? "").trim().toUpperCase());

/** Distance from a price to a budget range; 0 when inside it. */
function distance(price: number, range: { min: number; max: number }) {
  if (price < range.min) return range.min - price;
  if (price >= range.max) return price - range.max;
  return 0;
}

interface Scored extends Match {
  points: number;
}

function score(p: Product, a: QuizAnswers): Scored {
  const reasons: string[] = [];
  let points = 0;
  const d = p.diamond;

  const shape = d?.shape?.trim();
  if (a.look === "classic" && shape && /^round/i.test(shape)) {
    points += 2;
    reasons.push("A classic round brilliant cut");
  } else if (a.look === "modern" && shape && !/^round/i.test(shape)) {
    points += 2;
    reasons.push(`A distinctive ${shape.toLowerCase()} shape`);
  }

  const colour = rank(COLOURS, d?.color);
  const clarity = rank(CLARITIES, d?.clarity);

  if (a.priority === "sparkle") {
    const cut = d?.cut?.trim().toLowerCase();
    if (cut === "excellent" || cut === "ideal") {
      points += 2;
      reasons.push("Excellent cut for maximum sparkle");
    } else if (cut === "very good") {
      points += 1;
      reasons.push("A very good cut");
    }
  } else if (a.priority === "value") {
    // Near-colourless (G–J) and eye-clean (VS1–SI1): the guide's sweet spot.
    if (colour >= 3 && colour <= 6 && clarity >= 4 && clarity <= 6) {
      points += 2;
      reasons.push("Near-colourless and eye-clean, where the value is");
    }
  } else if (a.priority === "quality") {
    const topColour = colour >= 0 && colour <= 2; // D–F
    const topClarity = clarity >= 0 && clarity <= 4; // FL–VS1
    if (topColour && topClarity) {
      points += 2;
      reasons.push("Top-grade colour and clarity");
    } else if (topColour) {
      points += 1;
      reasons.push("Top-grade colour");
    } else if (topClarity) {
      points += 1;
      reasons.push("Top-grade clarity");
    }
  }

  return { product: p, reasons, points };
}

const statusRank: Record<Product["status"], number> = {
  available: 0,
  reserved: 1,
  sold: 2,
};

export function recommend(all: Product[], a: QuizAnswers): Recommendation {
  // Sold pieces can't be bought, so they never make a shortlist.
  let pool = all.filter((p) => p.status !== "sold");
  if (a.category !== ANY) pool = pool.filter((p) => p.category === a.category);

  const range = a.budget === ANY ? null : parsePrice(a.budget);
  let relaxed = false;
  let budgetReason = false;

  if (range) {
    const inside = pool.filter((p) => distance(p.price, range) === 0);
    if (inside.length > 0) {
      pool = inside;
      budgetReason = true;
    } else if (pool.length > 0) {
      relaxed = true;
      pool = [...pool].sort(
        (x, y) => distance(x.price, range) - distance(y.price, range),
      );
    }
  }

  const scored = pool.map((p, i) => {
    const m = score(p, a);
    if (budgetReason) m.reasons.unshift("Within your budget");
    return { ...m, i };
  });

  scored.sort((x, y) => {
    // When relaxing, keep the nearest-priced pieces first.
    if (relaxed) return x.i - y.i;
    return (
      y.points - x.points ||
      statusRank[x.product.status] - statusRank[y.product.status] ||
      x.i - y.i
    );
  });

  return {
    matches: scored
      .slice(0, MAX_RESULTS)
      .map(({ product, reasons }) => ({ product, reasons })),
    relaxed,
  };
}
