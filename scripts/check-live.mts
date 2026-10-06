/**
 * Go-live readiness check: asks the LIVE site what's set up and prints a
 * checklist of what's done and what's still to do.
 *
 *   npm run check-live                     # checks the default address below
 *   npm run check-live -- https://yourdomain.com
 *   npm run check-live -- --deep           # also proves Stripe checkout works
 *
 * Safe to run any time and as often as you like: it only reads pages, plus one
 * unsigned request to the Stripe webhook that the site rejects. It never sends
 * an email and never charges anyone. `--deep` creates one UNPAID Stripe
 * checkout session (it expires by itself) to confirm checkout works and say
 * whether it's in test or live mode.
 *
 * The judging lives in src/lib/readiness.ts (and is unit-tested); this file only
 * fetches and prints.
 */
import { buildChecklist, summarize, MANUAL_STEPS, type CheckItem, type Probes } from "../src/lib/readiness";
import type { HealthReport } from "../src/lib/health";

const DEFAULT_BASE = "https://dad-of-diamonds.vercel.app";

const args = process.argv.slice(2);
const deep = args.includes("--deep");
const base = (args.find((a) => /^https?:\/\//.test(a)) ?? process.env.SITE_URL ?? DEFAULT_BASE).replace(/\/$/, "");

async function call(path: string, init?: RequestInit) {
  try {
    const res = await fetch(base + path, { ...init, signal: AbortSignal.timeout(20_000), redirect: "follow" });
    return { status: res.status, text: await res.text() };
  } catch {
    return { status: null as number | null, text: "" };
  }
}

function json<T>(text: string): T | null {
  try {
    return JSON.parse(text) as T;
  } catch {
    return null;
  }
}

console.log(`\nChecking ${base}${deep ? "  (deep)" : ""}\n`);

const [home, products, rss, webhook, health, analytics] = await Promise.all([
  call("/"),
  call("/api/products"),
  call("/journal/rss.xml"),
  call("/api/webhook", { method: "POST" }),
  call("/api/health"),
  call("/_vercel/insights/script.js"),
]);

const feed = json<Array<{ id: string; status: string; images?: Array<{ src: string }> }>>(products.text);

const probes: Probes = {
  base,
  siteStatus: home.status,
  products: feed ? feed.map((p) => ({ id: p.id, imageSrc: p.images?.[0]?.src })) : null,
  journalPosts: rss.status === 200 ? (rss.text.match(/<item>/g) ?? []).length : null,
  webhookStatus: webhook.status,
  health: health.status === 200 ? json<HealthReport>(health.text) : null,
  analyticsStatus: analytics.status,
  placeholderTestimonials: home.status === 200 ? home.text.includes("[Client name]") : null,
};

const items: CheckItem[] = buildChecklist(probes);

if (deep) {
  const piece = feed?.find((p) => p.status === "available");
  if (!piece) {
    items.push({ id: "checkout", state: "unknown", title: "Stripe checkout works", detail: "No available piece to test with." });
  } else {
    const r = await call("/api/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ ids: [piece.id] }),
    });
    const out = json<{ url?: string; configured?: boolean; error?: string }>(r.text);
    const mode = out?.url?.match(/cs_(test|live)_/)?.[1];
    items.push(
      mode
        ? { id: "checkout", state: "ok", title: "Stripe checkout works", detail: `Created an unpaid ${mode}-mode session; it expires on its own.` }
        : out?.configured === false
          ? { id: "checkout", state: "todo", title: "Stripe checkout works", detail: "Stripe isn't configured, so checkout falls back to an enquiry." }
          : { id: "checkout", state: "todo", title: "Stripe checkout works", detail: `Stripe didn't create a session (${out?.error ?? `status ${r.status}`}).` },
    );
  }
}

const tag = { ok: "[ OK ]", todo: "[TODO]", unknown: "[ ?? ]" } as const;
for (const i of items) console.log(`${tag[i.state]} ${i.title}\n        ${i.detail}`);

const s = summarize(items);
console.log(`\n${s.ok} done, ${s.todo} to do${s.unknown ? `, ${s.unknown} couldn't be checked` : ""}.`);
console.log("\nNo tool can confirm these from outside, so do them by hand:");
for (const m of MANUAL_STEPS) console.log(`  - ${m}`);
console.log("");
