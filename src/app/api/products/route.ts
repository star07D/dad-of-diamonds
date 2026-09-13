import { NextResponse } from "next/server";
import { getAllProducts } from "@/lib/products";

/**
 * Public catalogue feed — the full Product shape. Used by the client-side
 * cart and wishlist to resolve the ids they keep in localStorage into
 * details they can render (reusing <ProductCard> etc. directly).
 */
export async function GET() {
  const products = await getAllProducts();
  return NextResponse.json(products);
}
