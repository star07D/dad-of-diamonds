"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";

const OPTIONS = [
  { value: "featured", label: "Featured" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "carat-desc", label: "Carat: Highest first" },
];

export function SortSelect() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const current = searchParams.get("sort") ?? "featured";

  function onChange(value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value === "featured") {
      params.delete("sort");
    } else {
      params.set("sort", value);
    }
    const query = params.toString();
    router.push(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }

  return (
    <label className="inline-flex items-center gap-2 text-sm text-muted">
      <span className="hidden sm:inline">Sort by</span>
      <select
        value={current}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Sort products"
        className="rounded-full border border-border bg-surface px-3.5 py-2 text-sm text-foreground outline-none transition-colors hover:border-accent focus:border-accent"
      >
        {OPTIONS.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
