import type { Product } from "./types";
import { formatPrice } from "./format";

/* Pure, no "server-only" — used by the shop page (server) and the
 * ShopFilters controls (client). */

export interface ActiveFilters {
  price?: string;
  shape?: string;
  color?: string;
  clarity?: string;
}

export const FILTER_KEYS = ["price", "shape", "color", "clarity"] as const;

const COLOURS = ["D", "E", "F", "G", "H", "I", "J", "K", "L", "M"];
const CLARITIES = ["FL", "IF", "VVS1", "VVS2", "VS1", "VS2", "SI1", "SI2", "I1", "I2", "I3"];

const PRICE_RANGES: Array<[number, number | null]> = [
  [0, 5000],
  [5000, 10000],
  [10000, 25000],
  [25000, null],
];

export const PRICE_OPTIONS = PRICE_RANGES.map(([min, max]) => ({
  value: `${min}-${max ?? ""}`,
  label:
    max === null
      ? `${formatPrice(min)} and up`
      : min === 0
        ? `Under ${formatPrice(max)}`
        : `${formatPrice(min)} – ${formatPrice(max)}`,
}));

export const COLOUR_OPTIONS = [
  { value: "F", label: "F or better" },
  { value: "H", label: "H or better" },
  { value: "J", label: "J or better" },
];

export const CLARITY_OPTIONS = [
  { value: "VVS2", label: "VVS or better" },
  { value: "VS2", label: "VS or better" },
  { value: "SI2", label: "SI or better" },
];

function parsePrice(value?: string): { min: number; max: number } | null {
  const m = value?.match(/^(\d+)-(\d*)$/);
  if (!m) return null;
  return { min: Number(m[1]), max: m[2] ? Number(m[2]) : Infinity };
}

/** Distinct diamond shapes present in the given products, alphabetical. */
export function shapesIn(products: Product[]): string[] {
  const set = new Set<string>();
  for (const p of products) if (p.diamond?.shape) set.add(p.diamond.shape);
  return [...set].sort();
}

export function filterProducts(
  products: Product[],
  f: ActiveFilters,
): Product[] {
  const price = parsePrice(f.price);
  const maxColour = f.color ? COLOURS.indexOf(f.color) : -1;
  const maxClarity = f.clarity ? CLARITIES.indexOf(f.clarity) : -1;

  return products.filter((p) => {
    if (price && (p.price < price.min || p.price >= price.max)) return false;
    if (f.shape && p.diamond?.shape !== f.shape) return false;
    if (maxColour >= 0) {
      const rank = COLOURS.indexOf((p.diamond?.color ?? "").charAt(0).toUpperCase());
      if (rank < 0 || rank > maxColour) return false;
    }
    if (maxClarity >= 0) {
      const rank = CLARITIES.indexOf((p.diamond?.clarity ?? "").toUpperCase());
      if (rank < 0 || rank > maxClarity) return false;
    }
    return true;
  });
}
