import type { HealthReport } from "./health";

/* Turns what `npm run check-live` saw on the live site into a go-live
 * checklist. Pure — the script does the fetching, this does the judging, so
 * the wording and the rules can be tested without a network. */

export type CheckState = "ok" | "todo" | "unknown";

export interface CheckItem {
  id: string;
  state: CheckState;
  title: string;
  detail: string;
}

export interface Probes {
  /** The address being checked, e.g. https://dad-of-diamonds.vercel.app */
  base: string;
  /** Status of GET / (null = couldn't connect). */
  siteStatus: number | null;
  /** The public catalogue feed, or null if it couldn't be read. */
  products: Array<{ id: string; imageSrc?: string }> | null;
  /** Number of published journal posts, or null if unreadable. */
  journalPosts: number | null;
  /** Status of an unsigned POST to the Stripe webhook. */
  webhookStatus: number | null;
  /** /api/health, or null if missing (an older deploy) or unreadable. */
  health: HealthReport | null;
  /** Status of GET /_vercel/insights/script.js. */
  analyticsStatus: number | null;
  /** Whether the home page still shows the placeholder testimonials. */
  placeholderTestimonials: boolean | null;
}

/** Things no tool can confirm from outside; listed so they aren't forgotten. */
export const MANUAL_STEPS = [
  "Make a test purchase with card 4242 4242 4242 4242 and confirm the piece flips to Sold and the order email arrives.",
  "Send a test enquiry from the contact form and confirm it reaches your inbox (this is the only way to confirm the Resend domain is verified).",
  "Have the Privacy Policy and Terms of Sale reviewed by a lawyer.",
  "Do a screen-reader pass (VoiceOver or NVDA) on the shop, a product page and checkout.",
  "Before taking real money: switch to Stripe live keys and add a separate live webhook secret.",
];

const item = (
  id: string,
  state: CheckState,
  title: string,
  detail: string,
): CheckItem => ({ id, state, title, detail });

const hostOf = (url: string) => {
  try {
    return new URL(url).host;
  } catch {
    return null;
  }
};

function catalogue(p: Probes): CheckItem {
  const title = "Real pieces and photos";
  if (!p.products) return item("catalogue", "unknown", title, "Couldn't read the catalogue.");
  const total = p.products.length;
  if (total === 0) return item("catalogue", "todo", title, "No pieces are listed. Add some in /studio.");
  const fromCms = p.products.some((x) => x.imageSrc?.includes("cdn.sanity.io"));
  if (!fromCms) {
    return item("catalogue", "todo", title, "The site is showing built-in sample data, so the CMS isn't connected.");
  }
  const starter = p.products.filter((x) => x.id.startsWith("seed-")).length;
  if (starter === total) {
    return item("catalogue", "todo", title, `All ${total} pieces are the placeholder starter set. Replace them with real pieces and photos in /studio.`);
  }
  if (starter > 0) {
    return item("catalogue", "todo", title, `${starter} of ${total} pieces are still placeholder starter pieces. Replace or delete them in /studio.`);
  }
  return item("catalogue", "ok", title, `${total} pieces listed, none of them the starter set.`);
}

export function buildChecklist(p: Probes): CheckItem[] {
  const out: CheckItem[] = [];
  const h = p.health;

  out.push(
    p.siteStatus === 200
      ? item("site", "ok", "The site is up", `${p.base} answered.`)
      : item("site", "todo", "The site is up", `${p.base} didn't answer normally (status ${p.siteStatus ?? "no connection"}).`),
  );

  out.push(catalogue(p));

  // Stripe key
  if (!h) {
    out.push(item("stripe", "unknown", "Stripe payments", "Couldn't read the setup status (/api/health isn't there yet — deploy the latest code)."));
  } else if (h.stripe === null) {
    out.push(item("stripe", "todo", "Stripe payments", "No STRIPE_SECRET_KEY, so the cart falls back to an enquiry instead of checkout."));
  } else if (h.stripe === "test") {
    out.push(item("stripe", "ok", "Stripe payments", "Working in TEST mode — correct for now. Switch to live keys only when you're ready for real money."));
  } else if (h.stripe === "live") {
    out.push(item("stripe", "ok", "Stripe payments", "LIVE mode — real payments are on."));
  } else {
    out.push(item("stripe", "unknown", "Stripe payments", "A Stripe key is set but it isn't clearly a test or live key."));
  }

  // Webhook: a 400 (missing signature) means the secret is set; 501 means it isn't.
  const webhookTitle = "Stripe webhook (marks pieces sold)";
  if (p.webhookStatus === 400) {
    out.push(item("webhook", "ok", webhookTitle, "The signing secret is set."));
  } else if (p.webhookStatus === 501) {
    out.push(item("webhook", "todo", webhookTitle, "STRIPE_WEBHOOK_SECRET isn't set, so payments won't mark pieces sold or send order emails."));
  } else {
    out.push(item("webhook", "unknown", webhookTitle, `Unexpected answer (status ${p.webhookStatus ?? "no connection"}).`));
  }

  // CMS write token
  if (h) {
    out.push(
      h.cmsWriteToken
        ? item("cms-write", "ok", "CMS write access (for marking sold)", "SANITY_API_WRITE_TOKEN is set.")
        : item("cms-write", "todo", "CMS write access (for marking sold)", "SANITY_API_WRITE_TOKEN isn't set, so you'd have to mark pieces sold by hand in /studio."),
    );
  }

  // Email
  const emailTitle = "Email (enquiries, order notices, receipts)";
  if (h) {
    if (!h.resend) {
      out.push(item("email", "todo", emailTitle, "No RESEND_API_KEY — forms fall back to WhatsApp/email buttons and no order emails go out."));
    } else if (!h.customSender) {
      out.push(item("email", "todo", emailTitle, "Sending works only to your own address until you verify a domain in Resend and set RESEND_FROM. Buyers won't get receipts yet."));
    } else {
      out.push(item("email", "ok", emailTitle, "Key and a custom sender are set. Whether the domain is verified can only be confirmed by sending one (see the list below)."));
    }

    // Site address
    const urlTitle = "Site address (links, sitemap, share cards)";
    if (!h.siteUrl) {
      out.push(item("site-url", "todo", urlTitle, "NEXT_PUBLIC_SITE_URL isn't set, so links and the sitemap point at localhost."));
    } else if (hostOf(h.siteUrl) !== hostOf(p.base)) {
      out.push(item("site-url", "todo", urlTitle, `NEXT_PUBLIC_SITE_URL says ${h.siteUrl} but you're checking ${p.base}. Update it when you add your own domain.`));
    } else {
      out.push(item("site-url", "ok", urlTitle, `${h.siteUrl}.`));
    }
  }

  // Analytics
  out.push(
    p.analyticsStatus === 200
      ? item("analytics", "ok", "Vercel Analytics", "The analytics script is being served.")
      : p.analyticsStatus === 404
        ? item("analytics", "todo", "Vercel Analytics", "Not enabled yet — turn it on in the Vercel dashboard (Analytics tab).")
        : item("analytics", "unknown", "Vercel Analytics", `Unexpected answer (status ${p.analyticsStatus ?? "no connection"}).`),
  );

  // Testimonials
  out.push(
    p.placeholderTestimonials === null
      ? item("testimonials", "unknown", "Real testimonials", "Couldn't read the home page.")
      : p.placeholderTestimonials
        ? item("testimonials", "todo", "Real testimonials", "The home page still shows the bracketed placeholder quotes. Replace them with real client quotes — or leave the section out.")
        : item("testimonials", "ok", "Real testimonials", "No placeholder quotes on the home page."),
  );

  // Journal
  out.push(
    p.journalPosts === null
      ? item("journal", "unknown", "Journal posts", "Couldn't read the journal feed.")
      : p.journalPosts === 0
        ? item("journal", "todo", "Journal posts", "No posts are published yet (optional). Write some in /studio, or run npm run seed to load three starters to edit.")
        : item("journal", "ok", "Journal posts", `${p.journalPosts} published.`),
  );

  return out;
}

export function summarize(items: CheckItem[]) {
  return {
    ok: items.filter((i) => i.state === "ok").length,
    todo: items.filter((i) => i.state === "todo").length,
    unknown: items.filter((i) => i.state === "unknown").length,
  };
}
