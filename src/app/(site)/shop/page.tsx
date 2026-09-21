import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { getAllProducts, getProductsByCategory, sortProducts } from "@/lib/products";
import { searchProducts } from "@/lib/search";
import { filterProducts, shapesIn, FILTER_KEYS } from "@/lib/filters";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { DiamondMark } from "@/components/logo";
import { SortSelect } from "@/components/sort-select";
import { ShopFilters } from "@/components/shop-filters";
import { CATEGORIES, categoryLabel } from "@/lib/site";

export const metadata: Metadata = {
  title: "Shop the collection",
  description:
    "Browse certified loose diamonds and finished jewellery — rings, necklaces, earrings and bracelets.",
};

export default async function ShopPage({
  searchParams,
}: PageProps<"/shop">) {
  const params = await searchParams;
  const active =
    typeof params.category === "string" ? params.category : undefined;
  const sort = typeof params.sort === "string" ? params.sort : undefined;
  const q = typeof params.q === "string" ? params.q : undefined;
  const filters = Object.fromEntries(
    FILTER_KEYS.map((k) => [k, typeof params[k] === "string" ? (params[k] as string) : undefined]),
  );
  const filtersActive = FILTER_KEYS.some((k) => filters[k]);

  const byCategory = active
    ? await getProductsByCategory(active)
    : await getAllProducts();
  const shapes = shapesIn(byCategory);
  const products = sortProducts(
    filterProducts(searchProducts(byCategory, q), filters),
    sort,
  );

  // Preserves sort/search/filters when switching category — every
  // FilterPill link carries whatever else is active.
  function filterHref(category?: string) {
    const p = new URLSearchParams();
    if (category) p.set("category", category);
    if (sort) p.set("sort", sort);
    if (q) p.set("q", q);
    for (const k of FILTER_KEYS) if (filters[k]) p.set(k, filters[k]!);
    const query = p.toString();
    return query ? `/shop?${query}` : "/shop";
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <Reveal>
        <p className="eyebrow">The collection</p>
        <h1 className="mt-2 font-display text-4xl">
          {q
            ? `Results for “${q}”`
            : active
              ? categoryLabel(active)
              : "Everything available"}
        </h1>
        <p className="mt-3 max-w-lg text-muted">
          {q || filtersActive
            ? `${products.length} piece${products.length === 1 ? "" : "s"} found.`
            : "Each item is unique. Prices are all-in; reserve online and we'll confirm the piece is held for you."}
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap gap-2">
            <FilterPill href={filterHref()} label="All" active={!active} />
            {CATEGORIES.map((c) => (
              <FilterPill
                key={c.slug}
                href={filterHref(c.slug)}
                label={c.label}
                active={active === c.slug}
              />
            ))}
          </div>
          <Suspense fallback={null}>
            <SortSelect />
          </Suspense>
        </div>

        <div className="mt-4">
          <Suspense fallback={null}>
            <ShopFilters shapes={shapes} />
          </Suspense>
        </div>
      </Reveal>

      {products.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <DiamondMark className="h-8 w-8 text-accent/60" />
          <p className="mt-4 text-muted">
            {q || filtersActive ? (
              <>
                {q ? <>Nothing matches &ldquo;{q}&rdquo;.</> : "Nothing matches those filters."}{" "}
                <Link
                  href={active ? `/shop?category=${active}` : "/shop"}
                  className="text-accent underline underline-offset-4"
                >
                  {q ? "Clear search" : "Clear filters"}
                </Link>
              </>
            ) : (
              <>
                Nothing in this category right now.{" "}
                <Link href="/contact" className="text-accent underline underline-offset-4">
                  Ask what&apos;s coming in
                </Link>
                .
              </>
            )}
          </p>
        </div>
      ) : (
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {products.map((product, i) => (
            <Reveal key={product.id} delay={(i % 3) * 70}>
              <ProductCard product={product} />
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}

function FilterPill({
  href,
  label,
  active,
}: {
  href: string;
  label: string;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`rounded-full border px-4 py-2 text-sm transition-all hover:-translate-y-0.5 active:translate-y-0 ${
        active
          ? "border-accent bg-accent text-accent-contrast"
          : "border-border hover:border-accent hover:text-accent"
      }`}
    >
      {label}
    </Link>
  );
}
