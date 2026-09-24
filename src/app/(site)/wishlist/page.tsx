"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useWishlist } from "@/lib/wishlist-context";
import { useCatalog } from "@/lib/use-catalog";
import { ProductCard } from "@/components/product-card";
import { DiamondMark } from "@/components/logo";
import { WishlistHint } from "@/components/wishlist-hint";
import { Reveal } from "@/components/reveal";

export default function WishlistPage() {
  const { ids, clear, hydrated } = useWishlist();
  const { catalog, error } = useCatalog();

  const items = useMemo(() => {
    if (!catalog) return [];
    const set = new Set(ids);
    // Preserve catalogue order (available first) rather than save order.
    return catalog.filter((p) => set.has(p.id));
  }, [catalog, ids]);

  if (!hydrated || catalog === null) {
    return (
      <div className="mx-auto min-h-[70vh] max-w-6xl px-4 py-20 sm:px-6">
        <p className="text-muted">{error ?? "Loading your wishlist…"}</p>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <DiamondMark className="animate-float h-10 w-10 text-accent" />
        <h1 className="mt-6 font-display text-3xl">Your wishlist is empty</h1>
        <p className="mt-3 text-muted">
          Tap the heart on any piece to save it here for later.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-block rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-contrast shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-95 hover:shadow-md active:translate-y-0"
        >
          Go to the shop
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <Reveal className="flex items-end justify-between">
        <div>
          <p className="eyebrow">Saved</p>
          <h1 className="mt-2 font-display text-4xl">Your wishlist</h1>
          <h2 className="sr-only">Saved pieces</h2>
        </div>
        <button
          type="button"
          onClick={clear}
          className="text-sm text-muted underline underline-offset-4 transition-colors hover:text-accent"
        >
          Clear all
        </button>
      </Reveal>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((product, i) => (
          <Reveal key={product.id} delay={(i % 3) * 70}>
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>

      <WishlistHint slugs={items.map((p) => p.slug)} />
    </div>
  );
}
