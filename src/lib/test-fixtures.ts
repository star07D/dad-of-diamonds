import type { Product } from "./types";

/** A valid in-stock loose diamond; override only what a test cares about. */
export function makeProduct(over: Partial<Product> & { id: string }): Product {
  return {
    slug: over.id,
    name: `Piece ${over.id}`,
    category: "loose-diamonds",
    price: 5000,
    summary: "A summary.",
    description: "A description.",
    images: [],
    status: "available",
    ...over,
  };
}
