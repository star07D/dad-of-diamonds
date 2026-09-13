"use client";

import { useWishlist } from "@/lib/wishlist-context";
import { HeartIcon } from "./heart-icon";

/**
 * `icon` — a small round overlay for product cards / the hero showcase.
 * `button` — a full labelled pill, for the product detail page.
 */
export function WishlistButton({
  productId,
  variant = "icon",
  className = "",
}: {
  productId: string;
  variant?: "icon" | "button";
  className?: string;
}) {
  const { has, toggle, hydrated } = useWishlist();
  const saved = hydrated && has(productId);

  function onClick(e: React.MouseEvent) {
    // The card this sits on top of is a <Link> — stop it from navigating.
    e.preventDefault();
    e.stopPropagation();
    toggle(productId);
  }

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={onClick}
        aria-pressed={saved}
        className={`inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3 text-sm transition-all hover:-translate-y-0.5 active:translate-y-0 ${
          saved
            ? "border-accent text-accent-strong"
            : "border-border hover:border-accent"
        } ${className}`}
      >
        <HeartIcon filled={saved} className="h-4 w-4" />
        {saved ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={saved}
      aria-label={saved ? "Remove from wishlist" : "Save to wishlist"}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/45 active:scale-95 ${
        saved ? "text-accent-strong" : "text-white"
      } ${className}`}
    >
      <HeartIcon filled={saved} className="h-4 w-4 drop-shadow" />
    </button>
  );
}
