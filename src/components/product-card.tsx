import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { StatusBadge } from "./status-badge";
import { WishlistButton } from "./wishlist-button";
import { CompareButton } from "./compare-button";
import { resizedSrc, resizedSrcSet } from "@/lib/image-url";

export function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  /** Above-the-fold cards load eagerly instead of lazily. */
  priority?: boolean;
}) {
  const image = product.images[0];
  const soldOut = product.status === "sold";

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition-all duration-300 hover:-translate-y-1 hover:border-accent hover:shadow-[0_16px_40px_-16px_rgba(0,0,0,0.35)]">
      {/* display:contents keeps this a real, fully-clickable link without
          nesting the wishlist button (below) inside an <a>. */}
      <Link href={`/product/${product.slug}`} className="contents">
        <div className="relative aspect-square overflow-hidden bg-surface-muted">
          <img
            src={resizedSrc(image?.src, 800)}
            srcSet={resizedSrcSet(image?.src, [400, 800, 1200])}
            sizes="(min-width: 1024px) 352px, (min-width: 640px) 50vw, 100vw"
            alt={image?.alt ?? product.name}
            className={`h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06] ${
              soldOut ? "opacity-60 grayscale" : ""
            }`}
            loading={priority ? "eager" : "lazy"}
            fetchPriority={priority ? "high" : "auto"}
            decoding="async"
          />
          {product.status !== "available" && (
            <div className="absolute left-3 top-3">
              <StatusBadge status={product.status} />
            </div>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-1 p-4">
          <h3 className="font-display text-lg leading-snug">{product.name}</h3>
          <p className="text-sm text-muted">{product.summary}</p>
          <p className="mt-3 text-sm font-medium text-accent-strong">
            {formatPrice(product.price)}
          </p>
        </div>
      </Link>

      <WishlistButton
        productId={product.id}
        className="absolute right-3 top-3 z-10"
      />
      {product.diamond && (
        <CompareButton
          productId={product.id}
          className="absolute right-3 top-14 z-10"
        />
      )}
    </div>
  );
}
