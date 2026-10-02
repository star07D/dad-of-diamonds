import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { formatPrice } from "./format";

describe("formatPrice", () => {
  it("formats whole dollars with no decimals", () => {
    assert.equal(formatPrice(16500), "$16,500");
    assert.equal(formatPrice(0), "$0");
  });
});

describe("formatDate", () => {
  // Imported after the timezone is changed: the formatter is built on import.
  // A reader west of UTC used to see the day before.
  let load = 0;
  async function formatIn(zone: string, iso: string) {
    const previous = process.env.TZ;
    process.env.TZ = zone;
    try {
      const mod = await import(`./format?load=${++load}`);
      return mod.formatDate(iso) as string;
    } finally {
      if (previous === undefined) delete process.env.TZ;
      else process.env.TZ = previous;
    }
  }

  it("shows the date as written", async () => {
    assert.equal(await formatIn("UTC", "2026-08-03"), "August 3, 2026");
    assert.equal(await formatIn("UTC", "2026-01-01"), "January 1, 2026");
    assert.equal(await formatIn("UTC", "2026-12-31"), "December 31, 2026");
  });

  it("does not shift a day for readers west of UTC", async () => {
    assert.equal(await formatIn("America/Los_Angeles", "2026-08-03"), "August 3, 2026");
  });

  it("does not shift a day for readers east of UTC", async () => {
    assert.equal(await formatIn("Pacific/Auckland", "2026-08-03"), "August 3, 2026");
  });
});
