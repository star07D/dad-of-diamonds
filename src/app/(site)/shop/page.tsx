import type { Metadata } from "next";
import Link from "next/link";
import { getAllProducts, getProductsByCategory } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { Reveal } from "@/components/reveal";
import { DiamondMark } from "@/components/logo";
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

  const products = active
    ? await getProductsByCategory(active)
    : await getAllProducts();

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <Reveal>
        <p className="eyebrow">The collection</p>
        <h1 className="mt-2 font-display text-4xl">
          {active ? categoryLabel(active) : "Everything available"}
        </h1>
        <p className="mt-3 max-w-lg text-muted">
          Each item is unique. Prices are all-in; reserve online and we&apos;ll
          confirm the piece is held for you.
        </p>

        <div className="mt-8 flex flex-wrap gap-2">
          <FilterPill href="/shop" label="All" active={!active} />
          {CATEGORIES.map((c) => (
            <FilterPill
              key={c.slug}
              href={`/shop?category=${c.slug}`}
              label={c.label}
              active={active === c.slug}
            />
          ))}
        </div>
      </Reveal>

      {products.length === 0 ? (
        <div className="mt-16 flex flex-col items-center text-center">
          <DiamondMark className="h-8 w-8 text-accent/60" />
          <p className="mt-4 text-muted">
            Nothing in this category right now.{" "}
            <Link href="/contact" className="text-accent underline underline-offset-4">
              Ask what&apos;s coming in
            </Link>
            .
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
