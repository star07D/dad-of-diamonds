"use client";

import { useCompare } from "@/lib/compare-context";

function ScaleIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect x="3" y="3" width="11" height="11" rx="2" />
      <rect x="10" y="10" width="11" height="11" rx="2" />
    </svg>
  );
}

/**
 * `icon` — a small round overlay for product cards, stacked below the
 * wishlist heart. `button` — a full labelled pill, for the product page.
 * Only meant to be rendered when `product.diamond` exists.
 */
export function CompareButton({
  productId,
  variant = "icon",
  className = "",
}: {
  productId: string;
  variant?: "icon" | "button";
  className?: string;
}) {
  const { has, toggle, hydrated, count, max } = useCompare();
  const active = hydrated && has(productId);
  const atLimit = hydrated && !active && count >= max;

  function onClick(e: React.MouseEvent) {
    // The card this sits on top of is a <Link> — stop it from navigating.
    e.preventDefault();
    e.stopPropagation();
    if (atLimit) return;
    toggle(productId);
  }

  const limitTitle = atLimit
    ? `You can compare up to ${max} pieces at a time`
    : undefined;

  if (variant === "button") {
    return (
      <button
        type="button"
        onClick={onClick}
        disabled={atLimit}
        aria-pressed={active}
        title={limitTitle}
        className={`inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3 text-sm transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 ${
          active
            ? "border-accent text-accent-strong"
            : "border-border hover:border-accent"
        } ${className}`}
      >
        <ScaleIcon className="h-4 w-4" />
        {active ? "Added to compare" : "Compare"}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={atLimit}
      aria-pressed={active}
      aria-label={active ? "Remove from comparison" : "Add to comparison"}
      title={limitTitle}
      className={`inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/30 backdrop-blur-sm transition-all hover:scale-110 hover:bg-black/45 active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 ${
        active ? "text-accent-strong" : "text-white"
      } ${className}`}
    >
      <ScaleIcon className="h-4 w-4 drop-shadow" />
    </button>
  );
}
