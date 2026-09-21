"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  CLARITY_OPTIONS,
  COLOUR_OPTIONS,
  FILTER_KEYS,
  PRICE_OPTIONS,
} from "@/lib/filters";

const selectClass =
  "rounded-full border border-border bg-surface px-3.5 py-2 text-sm text-foreground outline-none transition-colors hover:border-accent focus:border-accent";

export function ShopFilters({ shapes }: { shapes: string[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  function update(changes: Record<string, string>) {
    const params = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(changes)) {
      if (value) params.set(key, value);
      else params.delete(key);
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  const active = FILTER_KEYS.some((k) => searchParams.get(k));
  const hasDiamonds = shapes.length > 0;

  return (
    <div className="flex flex-wrap items-center gap-2">
      <select
        aria-label="Filter by price"
        value={searchParams.get("price") ?? ""}
        onChange={(e) => update({ price: e.target.value })}
        className={selectClass}
      >
        <option value="">Any price</option>
        {PRICE_OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>

      {hasDiamonds && (
        <>
          <select
            aria-label="Filter by shape"
            value={searchParams.get("shape") ?? ""}
            onChange={(e) => update({ shape: e.target.value })}
            className={selectClass}
          >
            <option value="">Any shape</option>
            {shapes.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by colour"
            value={searchParams.get("color") ?? ""}
            onChange={(e) => update({ color: e.target.value })}
            className={selectClass}
          >
            <option value="">Any colour</option>
            {COLOUR_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>

          <select
            aria-label="Filter by clarity"
            value={searchParams.get("clarity") ?? ""}
            onChange={(e) => update({ clarity: e.target.value })}
            className={selectClass}
          >
            <option value="">Any clarity</option>
            {CLARITY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </>
      )}

      {active && (
        <button
          type="button"
          onClick={() =>
            update(Object.fromEntries(FILTER_KEYS.map((k) => [k, ""])))
          }
          className="text-sm text-muted underline underline-offset-4 transition-colors hover:text-accent"
        >
          Clear filters
        </button>
      )}
    </div>
  );
}
