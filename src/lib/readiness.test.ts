import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { MANUAL_STEPS, buildChecklist, summarize, type Probes } from "./readiness";
import type { HealthReport } from "./health";

const BASE = "https://shop.example.com";

const readyHealth: HealthReport = {
  stripe: "test",
  webhookSecret: true,
  cmsProject: true,
  cmsWriteToken: true,
  resend: true,
  customSender: true,
  siteUrl: BASE,
};

/** A fully set-up site; each test breaks one thing. */
const ready: Probes = {
  base: BASE,
  siteStatus: 200,
  products: [
    { id: "real-1", imageSrc: "https://cdn.sanity.io/images/p/d/a.jpg" },
    { id: "real-2", imageSrc: "https://cdn.sanity.io/images/p/d/b.jpg" },
  ],
  journalPosts: 3,
  webhookStatus: 400,
  health: readyHealth,
  analyticsStatus: 200,
  placeholderTestimonials: false,
};

const stateOf = (p: Probes, id: string) => buildChecklist(p).find((i) => i.id === id)?.state;
const detailOf = (p: Probes, id: string) => buildChecklist(p).find((i) => i.id === id)?.detail ?? "";

describe("buildChecklist", () => {
  it("passes everything for a fully set-up site", () => {
    const items = buildChecklist(ready);
    assert.deepEqual(items.filter((i) => i.state !== "ok"), []);
    assert.deepEqual(summarize(items), { ok: items.length, todo: 0, unknown: 0 });
  });

  it("flags a site that doesn't answer", () => {
    assert.equal(stateOf({ ...ready, siteStatus: 502 }, "site"), "todo");
    assert.equal(stateOf({ ...ready, siteStatus: null }, "site"), "todo");
  });

  describe("catalogue", () => {
    it("flags the placeholder starter pieces", () => {
      const all = { ...ready, products: [{ id: "seed-a", imageSrc: "https://cdn.sanity.io/x.jpg" }, { id: "seed-b", imageSrc: "https://cdn.sanity.io/y.jpg" }] };
      assert.equal(stateOf(all, "catalogue"), "todo");
      assert.match(detailOf(all, "catalogue"), /All 2 pieces are the placeholder starter set/);
      const some = { ...ready, products: [...ready.products!, { id: "seed-c", imageSrc: "https://cdn.sanity.io/z.jpg" }] };
      assert.match(detailOf(some, "catalogue"), /1 of 3 pieces are still placeholder/);
    });

    it("flags built-in sample data when the CMS isn't connected", () => {
      const sample = { ...ready, products: [{ id: "d-round-101", imageSrc: "/products/loose-round-1.jpg" }] };
      assert.equal(stateOf(sample, "catalogue"), "todo");
      assert.match(detailOf(sample, "catalogue"), /sample data/);
    });

    it("flags an empty catalogue and copes with an unreadable one", () => {
      assert.equal(stateOf({ ...ready, products: [] }, "catalogue"), "todo");
      assert.equal(stateOf({ ...ready, products: null }, "catalogue"), "unknown");
    });
  });

  describe("Stripe", () => {
    it("is fine in test mode and says so in live mode", () => {
      assert.equal(stateOf(ready, "stripe"), "ok");
      assert.match(detailOf({ ...ready, health: { ...readyHealth, stripe: "live" } }, "stripe"), /LIVE/);
    });

    it("flags a missing key", () => {
      assert.equal(stateOf({ ...ready, health: { ...readyHealth, stripe: null } }, "stripe"), "todo");
    });

    it("can't say anything without the health report", () => {
      assert.equal(stateOf({ ...ready, health: null }, "stripe"), "unknown");
    });
  });

  describe("webhook", () => {
    it("reads 400 as the secret being set and 501 as it missing", () => {
      assert.equal(stateOf({ ...ready, webhookStatus: 400 }, "webhook"), "ok");
      assert.equal(stateOf({ ...ready, webhookStatus: 501 }, "webhook"), "todo");
    });

    it("doesn't guess at any other answer", () => {
      assert.equal(stateOf({ ...ready, webhookStatus: 200 }, "webhook"), "unknown");
      assert.equal(stateOf({ ...ready, webhookStatus: null }, "webhook"), "unknown");
    });
  });

  it("flags a missing CMS write token", () => {
    assert.equal(stateOf({ ...ready, health: { ...readyHealth, cmsWriteToken: false } }, "cms-write"), "todo");
  });

  describe("email", () => {
    it("flags no key", () => {
      assert.equal(stateOf({ ...ready, health: { ...readyHealth, resend: false, customSender: false } }, "email"), "todo");
    });

    it("flags a key with only the shared test sender, and says buyers won't get receipts", () => {
      const p = { ...ready, health: { ...readyHealth, customSender: false } };
      assert.equal(stateOf(p, "email"), "todo");
      assert.match(detailOf(p, "email"), /receipts/);
    });

    it("is ok with a key and a custom sender, but admits it can't confirm delivery", () => {
      assert.equal(stateOf(ready, "email"), "ok");
      assert.match(detailOf(ready, "email"), /can only be confirmed by sending one/);
    });
  });

  describe("site address", () => {
    it("flags an unset address and a different domain", () => {
      assert.equal(stateOf({ ...ready, health: { ...readyHealth, siteUrl: null } }, "site-url"), "todo");
      const moved = { ...ready, health: { ...readyHealth, siteUrl: "https://old.example.com" } };
      assert.equal(stateOf(moved, "site-url"), "todo");
      assert.match(detailOf(moved, "site-url"), /old\.example\.com/);
    });
  });

  it("reads analytics 200 as on and 404 as off", () => {
    assert.equal(stateOf({ ...ready, analyticsStatus: 200 }, "analytics"), "ok");
    assert.equal(stateOf({ ...ready, analyticsStatus: 404 }, "analytics"), "todo");
    assert.equal(stateOf({ ...ready, analyticsStatus: 500 }, "analytics"), "unknown");
  });

  it("flags placeholder testimonials", () => {
    assert.equal(stateOf({ ...ready, placeholderTestimonials: true }, "testimonials"), "todo");
    assert.equal(stateOf({ ...ready, placeholderTestimonials: null }, "testimonials"), "unknown");
  });

  it("treats having no journal posts as a to-do", () => {
    assert.equal(stateOf({ ...ready, journalPosts: 0 }, "journal"), "todo");
    assert.equal(stateOf({ ...ready, journalPosts: null }, "journal"), "unknown");
  });

  it("with no health report, leaves out the checks that depend on it", () => {
    const ids = buildChecklist({ ...ready, health: null }).map((i) => i.id);
    assert.ok(!ids.includes("email") && !ids.includes("cms-write") && !ids.includes("site-url"));
  });
});

describe("MANUAL_STEPS", () => {
  it("lists the things no tool can confirm", () => {
    assert.ok(MANUAL_STEPS.length >= 4);
    assert.ok(MANUAL_STEPS.some((s) => /test purchase/i.test(s)));
    assert.ok(MANUAL_STEPS.some((s) => /lawyer/i.test(s)));
  });
});
