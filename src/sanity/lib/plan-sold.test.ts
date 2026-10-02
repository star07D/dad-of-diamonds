import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { planSold, type ProductRow } from "./plan-sold";

const row = (over: Partial<ProductRow> & { _id: string }): ProductRow => ({
  _rev: `rev-${over._id}`,
  name: `Piece ${over._id}`,
  status: "available",
  ...over,
});

describe("planSold", () => {
  it("marks available and reserved pieces as newly sold", () => {
    const plan = planSold(
      ["a", "b"],
      [row({ _id: "a" }), row({ _id: "b", status: "reserved" })],
      "cs_1",
    );
    assert.deepEqual(plan.sold.map((s) => s.id), ["a", "b"]);
    assert.deepEqual(plan.sold[0], { id: "a", name: "Piece a", rev: "rev-a" });
    assert.deepEqual([plan.duplicates, plan.conflicts, plan.missing], [[], [], []]);
  });

  it("treats a piece already stamped with this payment as a repeat delivery", () => {
    const plan = planSold(
      ["a"],
      [row({ _id: "a", status: "sold", stripeSessionId: "cs_1" })],
      "cs_1",
    );
    assert.deepEqual(plan.duplicates, ["a"]);
    assert.deepEqual([plan.sold, plan.conflicts], [[], []]);
  });

  it("flags a piece sold to someone else as needing a refund", () => {
    const plan = planSold(
      ["a"],
      [row({ _id: "a", status: "sold", stripeSessionId: "cs_other" })],
      "cs_1",
    );
    assert.deepEqual(plan.conflicts, [{ id: "a", name: "Piece a" }]);
    assert.deepEqual([plan.sold, plan.duplicates], [[], []]);
  });

  it("flags a sold piece with no payment stamp as a conflict, not a repeat", () => {
    const plan = planSold(["a"], [row({ _id: "a", status: "sold" })], "cs_1");
    assert.equal(plan.conflicts.length, 1);
    assert.equal(plan.duplicates.length, 0);
  });

  it("reports ids that don't exist in the CMS", () => {
    const plan = planSold(["a", "ghost"], [row({ _id: "a" })], "cs_1");
    assert.deepEqual(plan.missing, ["ghost"]);
    assert.deepEqual(plan.sold.map((s) => s.id), ["a"]);
  });

  it("handles a mixed basket in one go", () => {
    const plan = planSold(
      ["new", "taken", "again", "ghost"],
      [
        row({ _id: "new" }),
        row({ _id: "taken", status: "sold", stripeSessionId: "cs_other" }),
        row({ _id: "again", status: "sold", stripeSessionId: "cs_1" }),
      ],
      "cs_1",
    );
    assert.deepEqual(plan.sold.map((s) => s.id), ["new"]);
    assert.deepEqual(plan.conflicts.map((c) => c.id), ["taken"]);
    assert.deepEqual(plan.duplicates, ["again"]);
    assert.deepEqual(plan.missing, ["ghost"]);
  });
});
