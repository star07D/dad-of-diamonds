import "server-only";
import type { Product } from "./types";
import { SAMPLE_PRODUCTS } from "./sample-products";

/**
 * Single entry point for reading the catalogue.
 *
 * Today it returns the local sample data. When the CMS is connected, swap the
 * body of `loadProducts()` for a Sanity query — every page goes through these
 * helpers, so nothing else has to change. See README → "Connect the CMS".
 */
async function loadProducts(): Promise<Product[]> {
  return SAMPLE_PRODUCTS;
}

export async function getAllProducts(): Promise<Product[]> {
  const products = await loadProducts();
  // Available first, then reserved, then sold.
  const rank: Record<Product["status"], number> = {
    available: 0,
    reserved: 1,
    sold: 2,
  };
  return [...products].sort((a, b) => rank[a.status] - rank[b.status]);
}

export async function getProductsByCategory(
  category: string,
): Promise<Product[]> {
  const products = await getAllProducts();
  return products.filter((p) => p.category === category);
}

export async function getFeaturedProducts(limit = 6): Promise<Product[]> {
  const products = await loadProducts();
  return products
    .filter((p) => p.featured && p.status !== "sold")
    .slice(0, limit);
}

export async function getProductBySlug(
  slug: string,
): Promise<Product | undefined> {
  const products = await loadProducts();
  return products.find((p) => p.slug === slug);
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  const products = await loadProducts();
  const set = new Set(ids);
  return products.filter((p) => set.has(p.id));
}
