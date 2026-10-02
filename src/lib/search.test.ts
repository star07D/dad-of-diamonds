import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { searchProducts } from "./search";
import { makeProduct } from "./test-fixtures";

const set = [
  makeProduct({ id: "a", name: "1.51ct Round Brilliant", summary: "Ideal cut", category: "loose-diamonds" }),
  makeProduct({ id: "b", name: "Platinum Solitaire", description: "Hand finished in platinum", category: "rings" }),
];

describe("searchProducts", () => {
  it("returns everything for an empty or blank query", () => {
    assert.equal(searchProducts(set, "").length, 2);
    assert.equal(searchProducts(set, "   ").length, 2);
    assert.equal(searchProducts(set, undefined).length, 2);
  });

  it("ignores case and surrounding spaces", () => {
    assert.deepEqual(searchProducts(set, "  ROUND ").map((p) => p.id), ["a"]);
  });

  it("looks in the summary, description and category too", () => {
    assert.deepEqual(searchProducts(set, "ideal").map((p) => p.id), ["a"]);
    assert.deepEqual(searchProducts(set, "hand finished").map((p) => p.id), ["b"]);
    assert.deepEqual(searchProducts(set, "rings").map((p) => p.id), ["b"]);
  });

  it("returns nothing when nothing matches", () => {
    assert.deepEqual(searchProducts(set, "emerald"), []);
  });
});
