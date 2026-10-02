import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { buildBuyerEmail, type BuyerEmailInput } from "./order-email";

const base: BuyerEmailInput = {
  name: "Jane Buyer",
  pieces: ["Diamond Bangle - 1.75ctw", "Tennis Bracelet - 5.00ctw"],
  total: "16,500 USD",
  reference: "cs_test_abc123",
  shipTo: ["1 Test Street", "10115 Berlin", "DE"],
};

describe("buildBuyerEmail", () => {
  it("greets the buyer by first name", () => {
    assert.ok(buildBuyerEmail(base).text.startsWith("Hi Jane,"));
  });

  it("falls back to a plain greeting when there is no name", () => {
    assert.ok(buildBuyerEmail({ ...base, name: null }).text.startsWith("Hello,"));
    assert.ok(buildBuyerEmail({ ...base, name: "   " }).text.startsWith("Hello,"));
  });

  it("lists every piece, the total and the payment reference", () => {
    const { text } = buildBuyerEmail(base);
    for (const p of base.pieces) assert.ok(text.includes(`- ${p}`), p);
    assert.ok(text.includes("Total paid: 16,500 USD"));
    assert.ok(text.includes("Payment reference: cs_test_abc123"));
  });

  it("includes the delivery address when there is one", () => {
    const { text } = buildBuyerEmail(base);
    assert.ok(text.includes("Delivering to:\n1 Test Street\n10115 Berlin\nDE"));
  });

  it("leaves the delivery section out when no address was collected", () => {
    assert.ok(!buildBuyerEmail({ ...base, shipTo: [] }).text.includes("Delivering to:"));
  });

  it("has a subject naming the shop, and makes no promises beyond what the site says", () => {
    const { subject, text } = buildBuyerEmail(base);
    assert.equal(subject, "Your Dad of Diamonds order is confirmed");
    assert.ok(text.includes("Delivery is insured and tracked."));
    assert.ok(!/within \d+|business days|free shipping|refund/i.test(text));
  });
});
