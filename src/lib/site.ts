/**
 * Central place for brand + contact details.
 * Change these once and the whole site updates.
 */
export const SITE = {
  name: "Dad of Diamonds",
  tagline: "Rare stones, made personal",
  description:
    "A private collection of certified diamonds and fine jewellery. Browse loose stones, engagement rings, and bespoke pieces, then reserve online.",
  // Used for absolute URLs (OG tags, Stripe redirects). Override in production
  // with NEXT_PUBLIC_SITE_URL.
  url:
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000",
  email: "dhruvpatel6530@gmail.com",
  phone: "+49 176 62754805",
  whatsapp: "https://wa.me/4917662754805",
  instagram: "https://instagram.com/dhruuv046",
  currency: "USD",
  locale: "en-US",
} as const;

export const CATEGORIES = [
  { slug: "loose-diamonds", label: "Loose Diamonds" },
  { slug: "rings", label: "Rings" },
  { slug: "necklaces", label: "Necklaces" },
  { slug: "earrings", label: "Earrings" },
  { slug: "bracelets", label: "Bracelets" },
] as const;

export type CategorySlug = (typeof CATEGORIES)[number]["slug"];

export function categoryLabel(slug: string): string {
  return CATEGORIES.find((c) => c.slug === slug)?.label ?? "Jewellery";
}
