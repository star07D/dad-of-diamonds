import Link from "next/link";
import type { Product } from "@/lib/types";
import { formatPrice } from "@/lib/format";
import { StatusBadge } from "./status-badge";

export function ProductCard({ product }: { product: Product }) {
  const image = product.images[0];
  const soldOut = product.status === "sold";

  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col overflow-hidden rounded-lg border border-border bg-surface transition-colors hover:border-accent"
    >
      <div className="relative aspect-square overflow-hidden bg-surface-muted">
        <img
          src={image?.src}
          alt={image?.alt ?? product.name}
          className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04] ${
            soldOut ? "opacity-60 grayscale" : ""
          }`}
          loading="lazy"
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
  );
}
