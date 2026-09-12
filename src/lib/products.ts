import "server-only";
import type { Product } from "./types";
import { SAMPLE_PRODUCTS } from "./sample-products";
import { sanityConfigured } from "@/sanity/env";
import { fetchProductsFromSanity } from "@/sanity/lib/queries";

/**
 * Single entry point for reading the catalogue.
 *
 * - If Sanity is configured (NEXT_PUBLIC_SANITY_PROJECT_ID is set), products
 *   come from the CMS.
 * - Otherwise the local sample data is used, so the site always renders.
 *
 * Every page reads through the helpers below — nothing else touches the source.
 */
async function loadProducts(): Promise<Product[]> {
  if (sanityConfigured) {
    try {
      return await fetchProductsFromSanity();
    } catch (err) {
      console.error("[products] Sanity fetch failed, using sample data:", err);
      return SAMPLE_PRODUCTS;
    }
  }
  return SAMPLE_PRODUCTS;
}

const statusRank: Record<Product["status"], number> = {
  available: 0,
  reserved: 1,
  sold: 2,
};

export async function getAllProducts(): Promise<Product[]> {
  const products = await loadProducts();
  return [...products].sort(
    (a, b) => statusRank[a.status] - statusRank[b.status],
  );
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

/**
 * "You may also like" — same category first (available before reserved
 * before sold), then tops up with other pieces so it's never short.
 */
export async function getRelatedProducts(
  product: Pick<Product, "id" | "category">,
  limit = 3,
): Promise<Product[]> {
  const products = await loadProducts();
  const rank = (p: Product) =>
    (p.category === product.category ? 0 : 10) + statusRank[p.status];

  return products
    .filter((p) => p.id !== product.id)
    .sort((a, b) => rank(a) - rank(b))
    .slice(0, limit);
}
