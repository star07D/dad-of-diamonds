import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  ANY,
  QUIZ,
  isComplete,
  parseAnswers,
  recommend,
  resultsHref,
  type QuizAnswers,
} from "./quiz";
import { makeProduct } from "./test-fixtures";

const answers = (over: Partial<QuizAnswers> = {}): QuizAnswers => ({
  category: ANY,
  budget: ANY,
  look: ANY,
  priority: ANY,
  ...over,
});

describe("parseAnswers / isComplete", () => {
  it("keeps real options and drops anything else", () => {
    assert.deepEqual(
      parseAnswers({ category: "rings", budget: "bogus", look: ["classic"] }),
      { category: "rings" },
    );
  });

  it("is only complete when every question is answered", () => {
    assert.equal(isComplete({ category: "rings" }), false);
    assert.equal(isComplete(answers()), true);
  });

  it("round-trips through the results URL", () => {
    const a = answers({ category: "rings", budget: "0-5000", look: "classic", priority: "sparkle" });
    const params = Object.fromEntries(new URL(resultsHref(a), "http://x").searchParams);
    assert.deepEqual(parseAnswers(params), a);
  });

  it("every question offers a no-preference style escape hatch", () => {
    for (const q of QUIZ) assert.ok(q.options.some((o) => o.value === ANY), q.key);
  });
});

describe("recommend", () => {
  it("never shows sold pieces", () => {
    const { matches } = recommend(
      [makeProduct({ id: "a", status: "sold" }), makeProduct({ id: "b" })],
      answers(),
    );
    assert.deepEqual(matches.map((m) => m.product.id), ["b"]);
  });

  it("filters by category", () => {
    const { matches } = recommend(
      [makeProduct({ id: "a", category: "rings" }), makeProduct({ id: "b" })],
      answers({ category: "rings" }),
    );
    assert.deepEqual(matches.map((m) => m.product.id), ["a"]);
  });

  it("keeps to the budget and says so", () => {
    const { matches, relaxed } = recommend(
      [makeProduct({ id: "in", price: 7200 }), makeProduct({ id: "out", price: 16500 })],
      answers({ budget: "5000-10000" }),
    );
    assert.equal(relaxed, false);
    assert.deepEqual(matches.map((m) => m.product.id), ["in"]);
    assert.ok(matches[0].reasons.includes("Within your budget"));
  });

  it("treats the top of a budget range as exclusive", () => {
    const { matches } = recommend(
      [makeProduct({ id: "edge", price: 10000 }), makeProduct({ id: "low", price: 9999 })],
      answers({ budget: "5000-10000" }),
    );
    assert.deepEqual(matches.map((m) => m.product.id), ["low"]);
  });

  it("falls back to the nearest-priced pieces when nothing fits", () => {
    const { matches, relaxed } = recommend(
      [
        makeProduct({ id: "far", price: 4600 }),
        makeProduct({ id: "near", price: 9800 }),
      ],
      answers({ budget: "25000-" }),
    );
    assert.equal(relaxed, true);
    assert.deepEqual(matches.map((m) => m.product.id), ["near", "far"]);
    assert.ok(!matches[0].reasons.includes("Within your budget"));
  });

  it("returns nothing, not relaxed, when the category is empty", () => {
    const r = recommend([makeProduct({ id: "a" })], answers({ category: "earrings" }));
    assert.deepEqual(r, { matches: [], relaxed: false });
  });

  it("ranks round brilliants first for a classic look, with a true reason", () => {
    const { matches } = recommend(
      [
        makeProduct({ id: "oval", diamond: { shape: "Oval" } }),
        makeProduct({ id: "round", diamond: { shape: "Round Brilliant" } }),
      ],
      answers({ look: "classic" }),
    );
    assert.equal(matches[0].product.id, "round");
    assert.deepEqual(matches[0].reasons, ["A classic round brilliant cut"]);
    assert.deepEqual(matches[1].reasons, []);
  });

  it("only credits a modern look for non-round shapes", () => {
    const { matches } = recommend(
      [
        makeProduct({ id: "round", diamond: { shape: "Round Brilliant" } }),
        makeProduct({ id: "pear", diamond: { shape: "Pear" } }),
      ],
      answers({ look: "modern" }),
    );
    assert.equal(matches[0].product.id, "pear");
    assert.deepEqual(matches[0].reasons, ["A distinctive pear shape"]);
  });

  it("values near-colourless, eye-clean stones for the value priority", () => {
    const { matches } = recommend(
      [
        makeProduct({ id: "top", diamond: { color: "D", clarity: "FL" } }),
        makeProduct({ id: "sweet", diamond: { color: "G", clarity: "VS2" } }),
      ],
      answers({ priority: "value" }),
    );
    assert.equal(matches[0].product.id, "sweet");
  });

  it("credits only the grades a piece actually has for quality", () => {
    const { matches } = recommend(
      [makeProduct({ id: "p", diamond: { color: "E", clarity: "SI1" } })],
      answers({ priority: "quality" }),
    );
    assert.deepEqual(matches[0].reasons, ["Top-grade colour"]);
  });

  it("never shows more than six, and prefers available over reserved on ties", () => {
    const many = Array.from({ length: 9 }, (_, i) => makeProduct({ id: `p${i}` }));
    assert.equal(recommend(many, answers()).matches.length, 6);

    const { matches } = recommend(
      [makeProduct({ id: "held", status: "reserved" }), makeProduct({ id: "free" })],
      answers(),
    );
    assert.deepEqual(matches.map((m) => m.product.id), ["free", "held"]);
  });

  it("tolerates pieces with no diamond details", () => {
    const { matches } = recommend(
      [makeProduct({ id: "ring", category: "rings" })],
      answers({ look: "classic", priority: "quality" }),
    );
    assert.deepEqual(matches[0].reasons, []);
  });
});
