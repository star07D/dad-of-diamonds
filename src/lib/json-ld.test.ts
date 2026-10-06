import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { articleJsonLd, breadcrumbJsonLd, productJsonLd } from "./json-ld";
import { makeProduct } from "./test-fixtures";
import { SITE } from "./site";

describe("breadcrumbJsonLd", () => {
  const trail = [
    { name: "Shop", path: "/shop" },
    { name: "Rings", path: "/shop?category=rings" },
    { name: "Platinum Solitaire" },
  ];
  const ld = breadcrumbJsonLd(trail);

  it("is a schema.org BreadcrumbList", () => {
    assert.equal(ld["@context"], "https://schema.org");
    assert.equal(ld["@type"], "BreadcrumbList");
  });

  it("numbers the items from 1, in order, with their names", () => {
    assert.deepEqual(
      ld.itemListElement.map((i) => [i.position, i.name]),
      [[1, "Shop"], [2, "Rings"], [3, "Platinum Solitaire"]],
    );
  });

  it("gives each linked item a full address on this site", () => {
    assert.equal(ld.itemListElement[0].item, `${SITE.url}/shop`);
    assert.equal(ld.itemListElement[1].item, `${SITE.url}/shop?category=rings`);
  });

  it("leaves the address off the current page, which is the last item", () => {
    assert.ok(!("item" in ld.itemListElement[2]));
  });
});

describe("articleJsonLd", () => {
  const post = {
    id: "p1",
    slug: "a-post",
    title: "A post",
    excerpt: "An excerpt.",
    body: "Body.",
    publishedAt: "2026-08-03",
  };

  it("describes the article with its date and address", () => {
    const ld = articleJsonLd(post);
    assert.equal(ld.headline, "A post");
    assert.equal(ld.datePublished, "2026-08-03");
    assert.equal(ld.url, `${SITE.url}/journal/a-post`);
  });

  it("includes an absolute image address only when there is a cover image", () => {
    assert.ok(!("image" in articleJsonLd(post)));
    const withCover = articleJsonLd({ ...post, coverImage: { src: "/journal/cover.jpg", alt: "Cover" } });
    assert.equal(withCover.image, `${SITE.url}/journal/cover.jpg`);
  });
});

describe("productJsonLd", () => {
  it("maps each stock status to the matching schema.org availability", () => {
    const offer = (status: "available" | "reserved" | "sold") =>
      (productJsonLd(makeProduct({ id: "x", status })).offers as { availability: string }).availability;
    assert.equal(offer("available"), "https://schema.org/InStock");
    assert.equal(offer("reserved"), "https://schema.org/Reserved");
    assert.equal(offer("sold"), "https://schema.org/SoldOut");
  });
});
