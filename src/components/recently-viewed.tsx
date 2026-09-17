"use client";

import { useMemo } from "react";
import { useRecentlyViewed } from "@/lib/recently-viewed-context";
import { useCatalog } from "@/lib/use-catalog";
import { ProductCard } from "./product-card";
import { Reveal } from "./reveal";
import type { Product } from "@/lib/types";

/** Homepage strip of pieces the visitor already looked at. Renders nothing until hydrated and non-empty. */
export function RecentlyViewed() {
  const { ids, hydrated } = useRecentlyViewed();
  const { catalog } = useCatalog();

  const products = useMemo(() => {
    if (!catalog || ids.length === 0) return [];
    const byId = new Map(catalog.map((p) => [p.id, p]));
    return ids
      .map((id) => byId.get(id))
      .filter((p): p is Product => Boolean(p));
  }, [catalog, ids]);

  if (!hydrated || products.length === 0) return null;

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
      <Reveal className="mb-8">
        <p className="eyebrow">Recently viewed</p>
        <h2 className="mt-2 font-display text-3xl">Pick up where you left off</h2>
      </Reveal>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.slice(0, 6).map((product, i) => (
          <Reveal key={product.id} delay={i * 70}>
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>
    </section>
  );
}
