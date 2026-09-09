import Stripe from "stripe";

const key = process.env.STRIPE_SECRET_KEY;

/** `null` until Stripe keys are added to the environment. */
export const stripe = key ? new Stripe(key) : null;

export const stripeConfigured = Boolean(key);
