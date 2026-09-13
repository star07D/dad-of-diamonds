"use client";

import Link from "next/link";
import { DiamondMark } from "./logo";
import { WishlistButton } from "./wishlist-button";
import { useLoupe } from "@/lib/use-loupe";
import { formatPrice } from "@/lib/format";
import type { Product } from "@/lib/types";

/**
 * The framed featured piece in the hero. A loupe follows the cursor across it.
 * The pointer handlers + cursor-light box live on the outer div (not the
 * link) so getBoundingClientRect() has a real box to measure, and so the
 * wishlist button can sit outside the <Link> without nesting interactives.
 */
export function HeroShowcase({ product }: { product: Product }) {
  const loupe = useLoupe();

  return (
    <div
      {...loupe}
      className="cursor-light hero-media relative w-full overflow-hidden rounded-xl border border-border bg-surface-muted shadow-lg"
    >
      <Link href={`/product/${product.slug}`} className="contents">
        <img
          src={product.images[0]?.src}
          alt={product.images[0]?.alt ?? product.name}
          className="aspect-[4/5] w-full object-cover transition-transform duration-[900ms] ease-out"
        />
        <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent p-4 pt-10 text-white">
          <p className="text-xs uppercase tracking-[0.18em] text-white/70">
            Featured
          </p>
          <p className="mt-1 font-display text-lg leading-tight">{product.name}</p>
          <p className="text-sm text-white/80">{formatPrice(product.price)}</p>
        </div>
        <DiamondMark className="absolute right-3 top-3 h-6 w-6 text-white/90 drop-shadow" />
      </Link>
      <WishlistButton
        productId={product.id}
        className="absolute left-3 top-3 z-10"
      />
    </div>
  );
}
