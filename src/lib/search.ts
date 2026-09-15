import type { Product } from "./types";

/**
 * Pure text filter — no "server-only" import, so it's safe to reuse from the
 * client-side SearchBox (live suggestions) as well as the shop page (server).
 */
export function searchProducts(products: Product[], query?: string): Product[] {
  const q = query?.trim().toLowerCase();
  if (!q) return products;
  return products.filter((p) =>
    [p.name, p.summary, p.description, p.category]
      .join(" ")
      .toLowerCase()
      .includes(q),
  );
}
