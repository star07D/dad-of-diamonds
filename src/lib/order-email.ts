import { SITE } from "./site";

/* The receipt sent to a buyer once their payment is confirmed. Pure, so the
 * wording can be checked without Stripe or Resend. It only states things the
 * site already says elsewhere (insured, tracked delivery) — no invented
 * timelines, costs or policies. */

export interface BuyerEmailInput {
  /** Full name from checkout, if given. */
  name?: string | null;
  /** Display names of the pieces bought. */
  pieces: string[];
  /** Already formatted, e.g. "16,500 USD". */
  total: string;
  /** Stripe payment reference, for support. */
  reference: string;
  /** Delivery address lines, if collected. */
  shipTo: string[];
  /** What the buyer chose at checkout, e.g. ring size or a gift message. */
  details?: Array<{ label: string; value: string }>;
}

export function buildBuyerEmail(input: BuyerEmailInput): {
  subject: string;
  text: string;
} {
  const first = input.name?.trim().split(/\s+/)[0];

  const text = [
    first ? `Hi ${first},` : "Hello,",
    "",
    "Thank you — your payment went through and your order is confirmed.",
    "",
    "Your order:",
    ...input.pieces.map((p) => `- ${p}`),
    `Total paid: ${input.total}`,
    ...(input.shipTo.length ? ["", "Delivering to:", ...input.shipTo] : []),
    ...(input.details?.length
      ? ["", "What you chose:", ...input.details.map((d) => `${d.label}: ${d.value}`)]
      : []),
    "",
    "We'll be in touch soon to confirm delivery details. Delivery is insured and tracked. If anything above looks wrong, or you have a question, just reply to this email.",
    "",
    `Payment reference: ${input.reference}`,
    "",
    `— ${SITE.name}`,
    `WhatsApp: ${SITE.whatsapp}`,
    `${SITE.url}`,
  ].join("\n");

  return { subject: `Your ${SITE.name} order is confirmed`, text };
}
