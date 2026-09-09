import type { CategorySlug } from "./site";

export type ProductStatus = "available" | "reserved" | "sold";

/** The 4 Cs and shape — only meaningful for diamonds, all optional. */
export interface DiamondSpec {
  carat?: number;
  cut?: string;
  color?: string;
  clarity?: string;
  shape?: string;
  /** e.g. "GIA", "IGI" */
  certificateLab?: string;
  certificateNumber?: string;
}

export interface ProductImage {
  src: string;
  alt: string;
}

export interface Product {
  /** Stable id (used as the Stripe line-item reference). */
  id: string;
  slug: string;
  name: string;
  category: CategorySlug;
  /** Price in the smallest currency unit is NOT used here — this is a plain
   * number in major units (e.g. rupees). Converted for Stripe at checkout. */
  price: number;
  /** Short one-liner shown on cards. */
  summary: string;
  /** Longer description, plain text, shown on the product page. */
  description: string;
  images: ProductImage[];
  status: ProductStatus;
  featured?: boolean;
  diamond?: DiamondSpec;
  /** Optional metal / material note for jewellery. */
  material?: string;
}
