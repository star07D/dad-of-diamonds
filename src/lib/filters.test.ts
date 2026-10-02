import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { filterProducts, parsePrice, shapesIn } from "./filters";
import { makeProduct } from "./test-fixtures";

const ids = (list: { id: string }[]) => list.map((p) => p.id);

describe("parsePrice", () => {
  it("reads bounded and open-ended ranges", () => {
    assert.deepEqual(parsePrice("5000-10000"), { min: 5000, max: 10000 });
    assert.deepEqual(parsePrice("25000-"), { min: 25000, max: Infinity });
  });

  it("rejects anything malformed", () => {
    assert.equal(parsePrice("cheap"), null);
    assert.equal(parsePrice(""), null);
    assert.equal(parsePrice(undefined), null);
  });
});

describe("filterProducts", () => {
  const set = [
    makeProduct({ id: "a", price: 4999, diamond: { shape: "Round Brilliant", color: "E", clarity: "VVS1" } }),
    makeProduct({ id: "b", price: 5000, diamond: { shape: "Oval", color: "H", clarity: "VS2" } }),
    makeProduct({ id: "c", price: 10000, diamond: { shape: "Oval", color: "K", clarity: "SI2" } }),
    makeProduct({ id: "d", price: 7000, category: "rings" }),
  ];

  it("returns everything when no filter is set", () => {
    assert.deepEqual(ids(filterProducts(set, {})), ["a", "b", "c", "d"]);
  });

  it("includes the bottom of a price range and excludes the top", () => {
    assert.deepEqual(ids(filterProducts(set, { price: "5000-10000" })), ["b", "d"]);
  });

  it("supports open-ended price ranges", () => {
    assert.deepEqual(ids(filterProducts(set, { price: "10000-" })), ["c"]);
  });

  it("matches shape exactly", () => {
    assert.deepEqual(ids(filterProducts(set, { shape: "Oval" })), ["b", "c"]);
  });

  it("treats colour as 'this grade or better'", () => {
    assert.deepEqual(ids(filterProducts(set, { color: "H" })), ["a", "b"]);
  });

  it("treats clarity as 'this grade or better'", () => {
    assert.deepEqual(ids(filterProducts(set, { clarity: "VS2" })), ["a", "b"]);
  });

  it("drops pieces with no grade when a grade filter is on", () => {
    assert.ok(!ids(filterProducts(set, { color: "J" })).includes("d"));
    assert.ok(!ids(filterProducts(set, { clarity: "SI2" })).includes("d"));
  });

  it("combines filters", () => {
    assert.deepEqual(
      ids(filterProducts(set, { shape: "Oval", color: "J", price: "0-9999" })),
      ["b"],
    );
  });

  it("ignores an unrecognised price value rather than hiding everything", () => {
    assert.equal(filterProducts(set, { price: "nonsense" }).length, set.length);
  });
});

describe("shapesIn", () => {
  it("lists each shape once, alphabetically", () => {
    const shapes = shapesIn([
      makeProduct({ id: "1", diamond: { shape: "Pear" } }),
      makeProduct({ id: "2", diamond: { shape: "Emerald" } }),
      makeProduct({ id: "3", diamond: { shape: "Pear" } }),
      makeProduct({ id: "4" }),
    ]);
    assert.deepEqual(shapes, ["Emerald", "Pear"]);
  });
});
