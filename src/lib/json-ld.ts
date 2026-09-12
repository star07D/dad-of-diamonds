import type { Product, ProductStatus } from "./types";
import { SITE, categoryLabel } from "./site";

function absoluteUrl(src: string): string {
  return new URL(src, SITE.url).toString();
}

const AVAILABILITY: Record<ProductStatus, string> = {
  available: "https://schema.org/InStock",
  reserved: "https://schema.org/Reserved",
  sold: "https://schema.org/SoldOut",
};

/** schema.org Product + Offer, for rich results on a product page. */
export function productJsonLd(product: Product) {
  const additionalProperty = product.diamond
    ? [
        product.diamond.carat != null && {
          "@type": "PropertyValue",
          name: "Carat",
          value: product.diamond.carat,
        },
        product.diamond.shape && {
          "@type": "PropertyValue",
          name: "Shape",
          value: product.diamond.shape,
        },
        product.diamond.cut && {
          "@type": "PropertyValue",
          name: "Cut",
          value: product.diamond.cut,
        },
        product.diamond.color && {
          "@type": "PropertyValue",
          name: "Colour",
          value: product.diamond.color,
        },
        product.diamond.clarity && {
          "@type": "PropertyValue",
          name: "Clarity",
          value: product.diamond.clarity,
        },
        product.diamond.certificateLab && {
          "@type": "PropertyValue",
          name: "Certificate",
          value: product.diamond.certificateLab,
        },
      ].filter(Boolean)
    : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: product.images.map((i) => absoluteUrl(i.src)),
    sku: product.id,
    category: categoryLabel(product.category),
    ...(product.material ? { material: product.material } : {}),
    ...(additionalProperty?.length ? { additionalProperty } : {}),
    brand: { "@type": "Brand", name: SITE.name },
    offers: {
      "@type": "Offer",
      url: `${SITE.url}/product/${product.slug}`,
      priceCurrency: SITE.currency,
      price: product.price,
      availability: AVAILABILITY[product.status],
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}

/** schema.org Organization, for brand recognition / knowledge panels. */
export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE.name,
    url: SITE.url,
    email: SITE.email,
    telephone: SITE.phone,
    description: SITE.description,
    sameAs: [SITE.instagram].filter(Boolean),
  };
}

/** schema.org WebSite, for a Google sitelinks search box. */
export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE.name,
    url: SITE.url,
  };
}
