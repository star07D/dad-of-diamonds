import { getClient } from "./client";
import type { Product } from "@/lib/types";

/**
 * Every field the storefront's `Product` type needs, shaped to match it as
 * closely as GROQ allows. Image assets are dereferenced to their CDN URL so the
 * front end needs no image builder.
 */
const PRODUCT_PROJECTION = /* groq */ `{
  "id": _id,
  "slug": slug.current,
  name,
  category,
  price,
  summary,
  description,
  status,
  featured,
  material,
  "images": images[]{
    "src": asset->url + "?w=1400&fit=max&auto=format",
    "alt": coalesce(alt, ^.name)
  },
  diamond
}`;

const ALL_PRODUCTS = /* groq */ `*[_type == "product" && defined(slug.current)] | order(
  select(status == "available" => 0, status == "reserved" => 1, 2) asc,
  _createdAt desc
) ${PRODUCT_PROJECTION}`;

type RawProduct = Omit<Product, "images"> & {
  images: Array<{ src: string | null; alt: string | null }> | null;
};

function normalise(raw: RawProduct): Product {
  return {
    ...raw,
    images: (raw.images ?? [])
      .filter((i): i is { src: string; alt: string | null } => Boolean(i.src))
      .map((i) => ({ src: i.src, alt: i.alt ?? raw.name })),
  };
}

export async function fetchProductsFromSanity(): Promise<Product[]> {
  const rows = await getClient().fetch<RawProduct[]>(
    ALL_PRODUCTS,
    {},
    { next: { revalidate: 60, tags: ["product"] } },
  );
  return rows.map(normalise);
}
