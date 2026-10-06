/**
 * Which setup steps the running site can see — yes/no only. This is served
 * publicly at /api/health so `npm run check-live` can tell what's configured
 * without ever sending an email or creating a payment. It must NEVER include a
 * secret's value: only whether it is set, which mode a Stripe key is in, and
 * the public site address.
 */

export type StripeMode = "test" | "live" | "unknown" | null;

export interface HealthReport {
  /** null = no Stripe secret key; otherwise the mode its prefix says. */
  stripe: StripeMode;
  webhookSecret: boolean;
  cmsProject: boolean;
  cmsWriteToken: boolean;
  resend: boolean;
  /** A sending address of your own, not Resend's shared test sender. */
  customSender: boolean;
  /** NEXT_PUBLIC_SITE_URL, or null if it isn't set. Public anyway. */
  siteUrl: string | null;
}

const has = (v: string | undefined) => Boolean(v && v.trim());

function stripeMode(key: string | undefined): StripeMode {
  if (!has(key)) return null;
  if (/^(sk|rk)_test_/.test(key!)) return "test";
  if (/^(sk|rk)_live_/.test(key!)) return "live";
  return "unknown";
}

export function healthReport(
  env: Record<string, string | undefined>,
): HealthReport {
  const from = env.RESEND_FROM;
  return {
    stripe: stripeMode(env.STRIPE_SECRET_KEY),
    webhookSecret: has(env.STRIPE_WEBHOOK_SECRET),
    cmsProject: has(env.NEXT_PUBLIC_SANITY_PROJECT_ID),
    cmsWriteToken: has(env.SANITY_API_WRITE_TOKEN),
    resend: has(env.RESEND_API_KEY),
    customSender: has(from) && !/resend\.dev/i.test(from!),
    siteUrl: has(env.NEXT_PUBLIC_SITE_URL)
      ? env.NEXT_PUBLIC_SITE_URL!.trim().replace(/\/$/, "")
      : null,
  };
}
