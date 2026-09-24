/*
 * Sanity's CDN resizes on the fly via `?w=`. The catalogue stores every image
 * at w=1400, so small slots (cards, thumbnails) would download 3-4x more than
 * they display. These helpers rewrite the width; local /products/* photos and
 * any non-Sanity URL are returned untouched.
 */

const isSanity = (src: string) => src.includes("cdn.sanity.io");

const withWidth = (src: string, w: number) =>
  /([?&])w=\d+/.test(src)
    ? src.replace(/([?&])w=\d+/, `$1w=${w}`)
    : `${src}${src.includes("?") ? "&" : "?"}w=${w}`;

/** A single resized URL — for fixed-size thumbnails. */
export function resizedSrc(src: string | undefined, width: number) {
  if (!src || !isSanity(src)) return src;
  return withWidth(src, width);
}

/** A `srcSet` string across several widths, or undefined for non-Sanity URLs. */
export function resizedSrcSet(src: string | undefined, widths: number[]) {
  if (!src || !isSanity(src)) return undefined;
  return widths.map((w) => `${withWidth(src, w)} ${w}w`).join(", ");
}
