import { Resend } from "resend";

const key = process.env.RESEND_API_KEY;

/** `null` until RESEND_API_KEY is added to the environment. */
export const resend = key ? new Resend(key) : null;

export const resendConfigured = Boolean(key);

/**
 * Sender address for outgoing mail. `onboarding@resend.dev` works with no
 * setup, but — without a verified sending domain in Resend — it can only
 * deliver to the email address the Resend account itself was created with.
 * Once a domain is verified, set RESEND_FROM to something like
 * "Dad of Diamonds <enquiries@yourdomain.com>".
 */
export const RESEND_FROM =
  process.env.RESEND_FROM || "Dad of Diamonds <onboarding@resend.dev>";
