import Link from "next/link";
import { getFeaturedProducts } from "@/lib/products";
import { ProductCard } from "@/components/product-card";
import { DiamondMark } from "@/components/logo";
import { Reveal } from "@/components/reveal";
import { HeroShowcase } from "@/components/hero-showcase";
import { Sparkles } from "@/components/sparkles";
import { CATEGORIES } from "@/lib/site";

export default async function HomePage() {
  const featured = await getFeaturedProducts(7);
  const hero = featured[0];
  const grid = (hero ? featured.slice(1) : featured).slice(0, 6);

  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden border-b border-border">
        <Sparkles />
        <div className="relative z-20 mx-auto grid max-w-6xl gap-10 px-4 py-20 sm:px-6 md:grid-cols-2 md:items-center md:py-28">
          <div className="hero-in min-w-0">
            <p className="eyebrow">A private diamond collection</p>
            <h1 className="mt-4 font-display text-4xl leading-[1.05] sm:text-5xl md:text-6xl">
              <span className="text-shimmer">
                Rare stones,
                <br />
                made personal.
              </span>
            </h1>
            <p className="mt-6 max-w-md text-lg text-muted">
              Certified loose diamonds and finished jewellery, hand-picked and
              sold direct. Browse the collection, reserve online, or commission
              something of your own.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/shop"
                className="rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-contrast shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-95 hover:shadow-md active:translate-y-0"
              >
                Browse the collection
              </Link>
              <Link
                href="/contact"
                className="rounded-full border border-border px-6 py-3 text-sm transition-all hover:-translate-y-0.5 hover:border-accent active:translate-y-0"
              >
                Book a private viewing
              </Link>
            </div>
          </div>

          <div className="relative mx-auto flex aspect-square w-full min-w-0 max-w-sm items-center justify-center">
            <div className="animate-glow absolute inset-0 rounded-full bg-accent/15 blur-3xl" />
            {hero ? (
              <HeroShowcase product={hero} />
            ) : (
              <DiamondMark
                draw
                className="animate-float relative h-56 w-56 text-accent sm:h-72 sm:w-72"
              />
            )}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <Reveal className="flex flex-wrap gap-3">
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/shop?category=${c.slug}`}
              className="rounded-full border border-border px-4 py-2 text-sm transition-all hover:-translate-y-0.5 hover:border-accent hover:text-accent"
            >
              {c.label}
            </Link>
          ))}
        </Reveal>
      </section>

      {/* Featured */}
      {grid.length > 0 && (
        <section className="mx-auto max-w-6xl px-4 pb-16 sm:px-6">
          <Reveal className="mb-8 flex items-end justify-between">
            <div>
              <p className="eyebrow">Recently added</p>
              <h2 className="mt-2 font-display text-3xl">Featured pieces</h2>
            </div>
            <Link
              href="/shop"
              className="text-sm text-accent underline underline-offset-4 hover:text-accent-strong"
            >
              View all
            </Link>
          </Reveal>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {grid.map((product, i) => (
              <Reveal key={product.id} delay={i * 70}>
                <ProductCard product={product} />
              </Reveal>
            ))}
          </div>
        </section>
      )}

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
          ].map((item, i) => (
            <Reveal key={item.title} delay={i * 90}>
              <h3 className="font-display text-xl">{item.title}</h3>
              <p className="mt-2 text-sm text-muted">{item.body}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="relative overflow-hidden">
        <DiamondMark
          draw
          className="animate-float pointer-events-none absolute -right-12 top-1/2 h-64 w-64 -translate-y-1/2 text-accent/15"
        />
        <DiamondMark className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 text-accent/10" />
        <Reveal className="mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
          <h2 className="font-display text-3xl sm:text-4xl">
            Not sure where to start?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted">
            Tell us your budget and the occasion. We&apos;ll send a short list of
            stones that fit, with photos and certificates.
          </p>
          <Link
            href="/contact"
            className="mt-8 inline-block rounded-full bg-accent px-6 py-3 text-sm font-medium text-accent-contrast shadow-sm transition-all hover:-translate-y-0.5 hover:opacity-95 hover:shadow-md active:translate-y-0"
          >
            Get in touch
          </Link>
        </Reveal>
      </section>
    </>
  );
}
