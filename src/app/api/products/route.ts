import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/products";

/**
 * Public catalogue feed. Used by the client-side cart to resolve the ids it
 * keeps in localStorage into full product details.
 */
export async function GET() {
  const products = await getAllProducts();
  return NextResponse.json(
    products.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      price: p.price,
      status: p.status,
      image: p.images[0]?.src ?? null,
      summary: p.summary,
    })),
  );
}
