import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { resizedSrc, resizedSrcSet } from "./image-url";

const sanity = "https://cdn.sanity.io/images/p/production/abc-1200x800.jpg?w=1400&fit=max&auto=format";

describe("resizedSrc", () => {
  it("rewrites an existing width on a Sanity URL and keeps the other params", () => {
    assert.equal(
      resizedSrc(sanity, 400),
      "https://cdn.sanity.io/images/p/production/abc-1200x800.jpg?w=400&fit=max&auto=format",
    );
  });

  it("adds a width when there is none, with the right separator", () => {
    assert.equal(
      resizedSrc("https://cdn.sanity.io/images/p/production/a.jpg", 400),
      "https://cdn.sanity.io/images/p/production/a.jpg?w=400",
    );
    assert.equal(
      resizedSrc("https://cdn.sanity.io/images/p/production/a.jpg?auto=format", 400),
      "https://cdn.sanity.io/images/p/production/a.jpg?auto=format&w=400",
    );
  });

  it("leaves local and other URLs alone", () => {
    assert.equal(resizedSrc("/products/loose-round-1.jpg", 400), "/products/loose-round-1.jpg");
    assert.equal(resizedSrc("https://example.com/a.jpg?w=1400", 400), "https://example.com/a.jpg?w=1400");
    assert.equal(resizedSrc(undefined, 400), undefined);
  });
});

describe("resizedSrcSet", () => {
  it("builds a width-descriptor list for Sanity images", () => {
    assert.equal(
      resizedSrcSet(sanity, [400, 800]),
      "https://cdn.sanity.io/images/p/production/abc-1200x800.jpg?w=400&fit=max&auto=format 400w, " +
        "https://cdn.sanity.io/images/p/production/abc-1200x800.jpg?w=800&fit=max&auto=format 800w",
    );
  });

  it("returns nothing for non-Sanity or missing images", () => {
    assert.equal(resizedSrcSet("/products/a.jpg", [400]), undefined);
    assert.equal(resizedSrcSet(undefined, [400]), undefined);
  });
});
