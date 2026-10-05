import type { Product } from "./types";
import { RING_SIZES } from "./ring-sizes";

/* The extra questions on Stripe's checkout page — a ring size when there's a
 * ring in the cart, and an optional gift message — and the reader that turns
 * the answers back into lines for the order emails. Pure, so it can be tested
 * without Stripe.
 *
 * Stripe's limits that shaped this: at most 3 custom fields, a label of up to
 * 50 characters, option labels up to 100, and option values and field keys
 * that are letters and digits only (so "7.5" has to become "us7h"). */

export interface CheckoutField {
  key: string;
  label: { type: "custom"; custom: string };
  type: "dropdown" | "text";
  optional: boolean;
  dropdown?: { options: Array<{ label: string; value: string }> };
  text?: { maximum_length: number; minimum_length?: number };
}

export const RING_SIZE_KEY = "ringsize";
export const GIFT_MESSAGE_KEY = "giftmessage";
export const SIZE_UNSURE = { label: "Not sure - please contact me", value: "unsure" };

/** "us7" for 7, "us7h" for 7.5 — Stripe option values can't contain a dot. */
const sizeValue = (us: string) => `us${us.replace(".5", "h")}`;

export function buildCheckoutFields(
  pieces: Array<Pick<Product, "category">>,
): CheckoutField[] {
  const rings = pieces.filter((p) => p.category === "rings").length;
  const fields: CheckoutField[] = [];

  if (rings === 1) {
    fields.push({
      key: RING_SIZE_KEY,
      label: { type: "custom", custom: "Ring size" },
      type: "dropdown",
      optional: false,
      dropdown: {
        options: [
          ...RING_SIZES.map((s) => ({
            label: `US ${s.us} · UK ${s.uk} · EU ${s.eu}`,
            value: sizeValue(s.us),
          })),
          SIZE_UNSURE,
        ],
      },
    });
  } else if (rings > 1) {
    // One dropdown can't describe several rings, so ask in words instead.
    fields.push({
      key: RING_SIZE_KEY,
      label: { type: "custom", custom: "Ring sizes, in cart order" },
      type: "text",
      optional: false,
      text: { minimum_length: 1, maximum_length: 100 },
    });
  }

  fields.push({
    key: GIFT_MESSAGE_KEY,
    label: { type: "custom", custom: "Gift message (optional)" },
    type: "text",
    optional: true,
    text: { maximum_length: 250 },
  });

  return fields;
}

/** The parts of a Stripe session's `custom_fields` this reads. */
export interface AnsweredField {
  label?: { custom?: string | null } | null;
  type?: string;
  dropdown?: {
    value?: string | null;
    options?: Array<{ label: string; value: string }> | null;
  } | null;
  text?: { value?: string | null } | null;
  numeric?: { value?: string | null } | null;
}

/** Answered questions as label/value pairs, skipping any left blank. A
 * dropdown answer is shown by its label ("US 7 · UK N½ …"), not its code. */
export function readCheckoutFields(
  fields?: AnsweredField[] | null,
): Array<{ label: string; value: string }> {
  const out: Array<{ label: string; value: string }> = [];
  for (const f of fields ?? []) {
    let value: string | null | undefined;
    if (f.dropdown) {
      const chosen = f.dropdown.value;
      value = f.dropdown.options?.find((o) => o.value === chosen)?.label ?? chosen;
    } else if (f.text) value = f.text.value;
    else if (f.numeric) value = f.numeric.value;

    const clean = value?.replace(/\s+/g, " ").trim();
    if (!clean) continue;
    out.push({ label: f.label?.custom?.trim() || "Detail", value: clean });
  }
  return out;
}
