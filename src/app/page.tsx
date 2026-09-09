import Link from "next/link";
import { getFeaturedProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { DiamondMark } from "@/components/logo";
import { CATEGORIES } from "@/lib/site";

export default async function HomePage() {
  const featured = await getFeaturedProducts(6);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <div className="mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-2 md:items-center md:py-28">
          <div>
            <p className="eyebrow">A private diamond collection</p>
            <h1 className="mt-4 font-display text-4xl leading-[1.05] sm:text-5xl md:text-6xl">
              Rare stones,
              <br />
              made personal.
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted">
              Certified loose diamonds and finished jewellery, hand-picked and
              sold direct. Browse the collection, reserve online, or commission
              something of your own.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-contrast transition-opacity hover:opacity-90"
              >
                Browse the collection
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-border px-6 py-3 text-sm transition-colors hover:border-accent"
              >
                Book a private viewing
              </Link>
            </div>
          </div>

          <div className="relative mx-auto flex aspect-square w-full max-w-sm items-center justify-center">
            <div className="absolute inset-0 rounded-full bg-accent/10 blur-2xl" />
            <DiamondMark className="relative h-56 w-56 text-accent sm:h-72 sm:w-72" />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="flex flex-wrap gap-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/shop?category=${c.slug}`}
              className="rounded-full border border-border px-4 py-2 text-sm transition-colors hover:border-accent hover:text-accent"
            >
              {c.label}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="eyebrow">Recently added</p>
            <h2 className="mt-2 font-display text-3xl">Featured pieces</h2>
          </div>
          <Link
            href="/shop"
            className="text-sm text-accent underline underline-offset-4"
          >
            View all
          </Link>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Trust */}
      <section className="border-y border-border bg-surface-muted">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-16 sm:px-6 md:grid-cols-3">
          {[
            {
              title: "Independently certified",
              body: "Every diamond ships with its original GIA or IGI certificate and laser inscription.",
            },
            {
              title: "Bought direct",
              body: "No showroom mark-up. Stones are sourced and priced by one person who knows them.",
            },
            {
              title: "Made to order",
              body: "Choose a loose stone and have it set, or commission a piece from a sketch.",
            },
          ].map((item) => (
            <div key={item.title}>
              <h3 className="font-display text-xl">{item.title}</h3>
              <p className="mt-2 text-sm text-muted">{item.body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
        <h2 className="font-display text-3xl sm:text-4xl">
          Not sure where to start?
        </h2>
        <p className="mx-auto mt-3 max-w-md text-muted">
          Tell us your budget and the occasion. We&apos;ll send a short list of
          stones that fit, with photos and certificates.
        </p>
        <Link
          href="/contact"
          className="mt-8 inline-block rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-contrast transition-opacity hover:opacity-90"
        >
          Get in touch
        </Link>
      </section>
    </>
  );
}
