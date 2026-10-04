import type { Product } from "./types";

/**
 * Pure text search — no "server-only" import, so it's safe to reuse from the
 * client-side SearchBox (live suggestions) as well as the shop page (server).
 *
 * The query is split into words and a piece matches only if EVERY word matches
 * somewhere in it, in any order — so "oval vs1" finds a 1.20ct oval graded VS1
 * whichever way round the name is written. A word of three or more letters
 * matches anywhere inside a word ("tinum" finds "platinum"). A one- or
 * two-letter word, like the colour grade "G", must start a word: otherwise "e"
 * would match nearly every piece, since almost every word contains one.
 */

/** Letters, digits and the dot in "1.51ct". Everything else separates words. */
const SEPARATORS = /[^a-z0-9.]+/;
const SHORT_WORD = 2;

function words(text: string): string[] {
  return text.toLowerCase().split(SEPARATORS).filter(Boolean);
}

function haystack(p: Product): string[] {
  const d = p.diamond;
  return words(
    [
      p.name,
      p.summary,
      p.description,
      p.category,
      p.material,
      d?.shape,
      d?.cut,
      d?.color,
      d?.clarity,
      d?.certificateLab,
    ]
      .filter(Boolean)
      .join(" "),
  );
}

function matches(piece: string[], word: string): boolean {
  return word.length <= SHORT_WORD
    ? piece.some((w) => w.startsWith(word))
    : piece.some((w) => w.includes(word));
}

export function searchProducts(products: Product[], query?: string): Product[] {
  const wanted = words(query ?? "");
  if (wanted.length === 0) return products;
  return products.filter((p) => {
    const piece = haystack(p);
    return wanted.every((w) => matches(piece, w));
  });
}
