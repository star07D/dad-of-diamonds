import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { searchProducts } from "./search";
import { makeProduct } from "./test-fixtures";

const set = [
  makeProduct({ id: "a", name: "1.51ct Round Brilliant", summary: "Ideal cut", category: "loose-diamonds" }),
  makeProduct({ id: "b", name: "Platinum Solitaire", description: "Hand finished in platinum", category: "rings" }),
];

const ids = (list: { id: string }[]) => list.map((p) => p.id);

describe("searchProducts", () => {
  it("returns everything for an empty or blank query", () => {
    assert.equal(searchProducts(set, "").length, 2);
    assert.equal(searchProducts(set, "   ").length, 2);
    assert.equal(searchProducts(set, undefined).length, 2);
  });

  it("ignores case and surrounding spaces", () => {
    assert.deepEqual(ids(searchProducts(set, "  ROUND ")), ["a"]);
  });

  it("looks in the summary, description and category too", () => {
    assert.deepEqual(ids(searchProducts(set, "ideal")), ["a"]);
    assert.deepEqual(ids(searchProducts(set, "hand finished")), ["b"]);
    assert.deepEqual(ids(searchProducts(set, "rings")), ["b"]);
  });

  it("returns nothing when nothing matches", () => {
    assert.deepEqual(searchProducts(set, "emerald"), []);
  });
});

describe("searchProducts: several words", () => {
  it("doesn't care what order the words are in", () => {
    assert.deepEqual(ids(searchProducts(set, "brilliant round")), ["a"]);
  });

  it("needs every word to match, though not in the same field", () => {
    assert.deepEqual(ids(searchProducts(set, "round ideal")), ["a"]);
    assert.deepEqual(searchProducts(set, "round platinum"), []);
  });

  it("ignores punctuation between words", () => {
    assert.deepEqual(ids(searchProducts(set, "round, brilliant / ideal")), ["a"]);
  });

  it("treats a query of only punctuation as no query", () => {
    assert.equal(searchProducts(set, " / , ").length, 2);
  });
});

describe("searchProducts: the grades and details of a stone", () => {
  const stones = [
    makeProduct({
      id: "oval",
      name: "Bright oval",
      summary: "Eye-clean.",
      description: "Hand picked.",
      diamond: { shape: "Oval", color: "G", clarity: "SI1", cut: "Excellent", certificateLab: "GIA" },
    }),
    makeProduct({
      id: "pear",
      name: "Warm pear",
      summary: "Over three carats.",
      description: "Hand picked.",
      material: "950 Platinum",
      diamond: { shape: "Pear", color: "H", clarity: "VS2", cut: "Ideal", certificateLab: "IGI" },
    }),
  ];

  it("finds a stone by its grades even when the name doesn't say them", () => {
    assert.deepEqual(ids(searchProducts(stones, "oval si1")), ["oval"]);
    assert.deepEqual(ids(searchProducts(stones, "vs2")), ["pear"]);
    assert.deepEqual(ids(searchProducts(stones, "gia")), ["oval"]);
    assert.deepEqual(ids(searchProducts(stones, "excellent")), ["oval"]);
    assert.deepEqual(ids(searchProducts(stones, "ideal")), ["pear"]);
  });

  it("finds a piece by its metal", () => {
    assert.deepEqual(ids(searchProducts(stones, "platinum")), ["pear"]);
  });

  it("matches a one- or two-letter grade only as a whole word's start, not inside other words", () => {
    // "g" is the oval's colour grade and starts "GIA"; no word of the pear's starts with g.
    assert.deepEqual(ids(searchProducts(stones, "g")), ["oval"]);
    // "e" sits inside "pear" and "three" but starts a word only in the oval ("Eye-clean", "Excellent").
    assert.deepEqual(ids(searchProducts(stones, "e")), ["oval"]);
  });

  it("still finds longer words in the middle of other words", () => {
    assert.deepEqual(ids(searchProducts(stones, "tinum")), ["pear"]);
  });
});
