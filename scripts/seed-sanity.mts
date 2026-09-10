/**
 * One-time: load the 12 starter pieces (and their placeholder images) into
 * Sanity so the Studio isn't empty. Safe to re-run — it replaces by id.
 *
 * Setup — put these in .env.local:
 *   NEXT_PUBLIC_SANITY_PROJECT_ID=...
 *   NEXT_PUBLIC_SANITY_DATASET=production
 *   SANITY_API_WRITE_TOKEN=...        (Editor token from sanity.io/manage → API → Tokens)
 *
 * Run:
 *   npm run seed
 *
 * Then open /studio, swap the placeholder images for real photos, and delete
 * anything you don't want.
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { createClient } from "@sanity/client";
import { SAMPLE_PRODUCTS } from "../src/lib/sample-products";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

for (const file of [".env.local", ".env"]) {
  try {
    for (const line of readFileSync(join(root, file), "utf8").split("\n")) {
      const m = line.match(/^\s*([\w.-]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) {
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
      }
    }
  } catch {
    /* optional */
  }
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || "production";
const token = process.env.SANITY_API_WRITE_TOKEN;

if (!projectId) {
  console.error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID in .env.local");
  process.exit(1);
}
if (!token) {
  console.error(
    "Missing SANITY_API_WRITE_TOKEN in .env.local\n" +
      "Create one at https://www.sanity.io/manage → project → API → Tokens (Editor role).",
  );
  process.exit(1);
}

const client = createClient({
  projectId,
  dataset,
  token,
  apiVersion: "2024-10-01",
  useCdn: false,
});

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/** Retry a Sanity call a few times — their asset endpoint 502s occasionally. */
async function withRetry<T>(label: string, fn: () => Promise<T>): Promise<T> {
  for (let attempt = 1; ; attempt++) {
    try {
      return await fn();
    } catch (err) {
      if (attempt >= 5) throw err;
      const wait = attempt * 2000;
      console.log(`  ${label} failed (attempt ${attempt}), retrying in ${wait / 1000}s…`);
      await sleep(wait);
    }
  }
}

const uploaded = new Map<string, string>();

async function uploadImage(src: string, alt: string) {
  if (!uploaded.has(src)) {
    const buf = readFileSync(join(root, "public", src.replace(/^\//, "")));
    const asset = await withRetry(`upload ${src}`, () =>
      client.assets.upload("image", buf, { filename: src.split("/").pop() }),
    );
    uploaded.set(src, asset._id);
    console.log("  uploaded", src);
  }
  return {
    _type: "image" as const,
    _key: Math.random().toString(36).slice(2),
    asset: { _type: "reference" as const, _ref: uploaded.get(src)! },
    alt,
  };
}

for (const p of SAMPLE_PRODUCTS) {
  console.log("seeding", p.name);
  const images: Awaited<ReturnType<typeof uploadImage>>[] = [];
  for (const img of p.images) images.push(await uploadImage(img.src, img.alt));

  await withRetry(`write ${p.id}`, () =>
    client.createOrReplace({
    _id: `seed-${p.id}`,
    _type: "product",
    name: p.name,
    slug: { _type: "slug", current: p.slug },
    category: p.category,
    price: p.price,
    status: p.status,
    featured: p.featured ?? false,
    summary: p.summary,
    description: p.description,
    ...(p.material ? { material: p.material } : {}),
    images,
    ...(p.diamond ? { diamond: p.diamond } : {}),
    }),
  );
}

console.log(`\nDone - ${SAMPLE_PRODUCTS.length} pieces in Sanity. Open /studio.`);
