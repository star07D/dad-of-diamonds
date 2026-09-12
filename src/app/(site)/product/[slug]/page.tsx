import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  getAllProducts,
  getProductBySlug,
} from "@/lib/products";
import { formatPrice } from "@/lib/format";
import { categoryLabel } from "@/lib/site";
import { AddToCart } from "@/components/add-to-cart";
import { StatusBadge } from "@/components/status-badge";
import { ProductGallery } from "@/components/product-gallery";
import { Reveal } from "@/components/reveal";
import { JsonLd } from "@/components/json-ld";
import { productJsonLd } from "@/lib/json-ld";

export async function generateStaticParams() {
  const products = await getAllProducts();
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: PageProps<"/product/[slug]">): Promise<Metadata> {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) return { title: "Not found" };
  return {
    title: product.name,
    description: product.summary,
    openGraph: {
      title: product.name,
      description: product.summary,
      images: product.images.map((i) => i.src),
    },
  };
}

export default async function ProductPage({
  params,
}: PageProps<"/product/[slug]">) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product) notFound();

  const specs: Array<[string, string | undefined]> = product.diamond
    ? [
        ["Carat", product.diamond.carat ? `${product.diamond.carat.toFixed(2)} ct` : undefined],
        ["Shape", product.diamond.shape],
        ["Cut", product.diamond.cut],
        ["Colour", product.diamond.color],
        ["Clarity", product.diamond.clarity],
        ["Certificate", product.diamond.certificateLab],
      ]
    : [];
  if (product.material) specs.unshift(["Metal", product.material]);

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
      <JsonLd data={productJsonLd(product)} />
      <nav className="text-sm text-muted">
        <Link href="/shop" className="hover:text-accent">
          Shop
        </Link>
        <span className="mx-2">/</span>
        <Link
          href={`/shop?category=${product.category}`}
          className="hover:text-accent"
        >
          {categoryLabel(product.category)}
        </Link>
      </nav>

      <div className="mt-6 grid gap-10 md:grid-cols-2 md:gap-14">
        <Reveal>
          <ProductGallery
            images={product.images}
            sold={product.status === "sold"}
          />
        </Reveal>

        <Reveal delay={90}>
          {product.status !== "available" && (
            <div className="mb-4">
              <StatusBadge status={product.status} />
            </div>
          )}
          <h1 className="font-display text-3xl sm:text-4xl">{product.name}</h1>
          <p className="mt-3 text-lg text-muted">{product.summary}</p>
          <p className="mt-6 text-2xl font-medium text-accent-strong">
            {formatPrice(product.price)}
          </p>

          <div className="mt-8">
            <AddToCart product={product} />
          </div>

          {specs.length > 0 && (
            <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-4 border-t border-border pt-8">
              {specs
                .filter(([, value]) => value)
                .map(([label, value]) => (
                  <div key={label}>
                    <dt className="eyebrow">{label}</dt>
                    <dd className="mt-1 text-sm">{value}</dd>
                  </div>
                ))}
            </dl>
          )}

          <div className="mt-10 border-t border-border pt-8">
            <h2 className="font-display text-xl">Details</h2>
            <p className="mt-3 whitespace-pre-line text-sm leading-relaxed text-muted">
              {product.description}
            </p>
          </div>
        </Reveal>
      </div>
    </div>
  );
}
