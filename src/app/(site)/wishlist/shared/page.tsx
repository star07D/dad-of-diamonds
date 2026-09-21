import type { Metadata } from "next";
import Link from "next/link";
import { getAllProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { DiamondMark } from "@/components/logo";
import { Reveal } from "@/components/reveal";

export const metadata: Metadata = {
  title: "A hint",
  description: "A few pieces someone thought you'd like.",
  // A personal link, not something to surface in search results.
  robots: { index: false },
};

const MAX = 24;

export default async function SharedWishlistPage({
  searchParams,
}: PageProps<"/wishlist/shared">) {
  const params = await searchParams;
  const slugs =
    typeof params.items === "string"
      ? params.items.split(",").filter(Boolean).slice(0, MAX)
      : [];
  const from =
    typeof params.from === "string" ? params.from.trim().slice(0, 40) : "";

  const all = await getAllProducts();
  const bySlug = new Map(all.map((p) => [p.slug, p]));
  const products = slugs.flatMap((s) => bySlug.get(s) ?? []);

  if (products.length === 0) {
    return (
      <div className="mx-auto flex max-w-3xl flex-col items-center px-4 py-24 text-center sm:px-6">
        <DiamondMark className="animate-float h-10 w-10 text-accent" />
        <h1 className="mt-6 font-display text-3xl">This list is empty</h1>
        <p className="mt-3 text-muted">
          The link may be incomplete, or the pieces are no longer listed.
        </p>
        <Link
          href="/shop"
          className="mt-8 inline-block rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-contrast shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-95 hover:shadow-md active:translate-y-0"
        >
          Browse the collection
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
      <Reveal>
        <p className="eyebrow">A hint</p>
        <h1 className="mt-2 font-display text-4xl">
          {from ? `${from} thought you’d like these` : "A few pieces you might like"}
        </h1>
        <p className="mt-3 max-w-lg text-muted">
          Tap the heart on any piece to save it to your own wishlist.
        </p>
      </Reveal>

      <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map((product, i) => (
          <Reveal key={product.id} delay={(i % 3) * 70}>
            <ProductCard product={product} />
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-12">
        <Link
          href="/shop"
          className="inline-block rounded-full border border-border px-6 py-3 text-sm transition-all hover:-translate-y-0.5 hover:border-accent active:translate-y-0"
        >
          Browse the whole collection
        </Link>
      </Reveal>
    </div>
  );
}
