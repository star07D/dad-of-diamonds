"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import { useCart } from "@/lib/cart-context";
import type { Product } from "@/lib/types";

export function AddToCart({ product }: { product: Product }) {
  const { has, add, hydrated } = useCart();
  const router = useRouter();

  if (product.status !== "available") {
    return (
      <div className="space-y-3">
        <button
          disabled
          className="w-full cursor-not-allowed rounded-full border border-border px-6 py-3 text-sm text-muted"
        >
          {product.status === "reserved" ? "Currently reserved" : "Sold"}
        </button>
        <p className="text-sm text-muted">
          Looking for something similar?{" "}
          <Link href="/contact" className="text-accent underline underline-offset-4">
            Ask about a bespoke piece
          </Link>
          .
        </p>
      </div>
    );
  }

  const inCart = hydrated && has(product.id);

  return (
    <div className="space-y-3">
      <div className="flex flex-col gap-3 sm:flex-row">
        <button
          type="button"
          onClick={() => {
            add(product.id);
            router.push("/cart");
          }}
          className="flex-1 rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-contrast transition-opacity hover:opacity-90"
        >
          Reserve now
        </button>
        <button
          type="button"
          onClick={() => add(product.id)}
          disabled={inCart}
          className="flex-1 rounded-full border border-border px-6 py-3 text-sm transition-colors hover:border-accent disabled:cursor-not-allowed disabled:opacity-60"
        >
          {inCart ? "In your cart" : "Add to cart"}
        </button>
      </div>
      <p className="text-sm text-muted">
        Secure checkout via Stripe. Each piece is one of a kind — reserving holds
        it for you while payment is confirmed.
      </p>
    </div>
  );
}
