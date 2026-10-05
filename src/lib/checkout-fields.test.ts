import { describe, it } from "node:test";
import assert from "node:assert/strict";
import {
  GIFT_MESSAGE_KEY,
  RING_SIZE_KEY,
  buildCheckoutFields,
  readCheckoutFields,
  type AnsweredField,
} from "./checkout-fields";
import { RING_SIZES } from "./ring-sizes";

const ring = { category: "rings" as const };
const stone = { category: "loose-diamonds" as const };

describe("buildCheckoutFields", () => {
  it("offers only the gift message when there's no ring", () => {
    const fields = buildCheckoutFields([stone, { category: "earrings" }]);
    assert.deepEqual(fields.map((f) => f.key), [GIFT_MESSAGE_KEY]);
    assert.equal(fields[0].optional, true);
  });

  it("asks for a required ring-size dropdown when there is exactly one ring", () => {
    const [size, gift] = buildCheckoutFields([stone, ring]);
    assert.equal(size.key, RING_SIZE_KEY);
    assert.equal(size.type, "dropdown");
    assert.equal(size.optional, false);
    assert.equal(gift.key, GIFT_MESSAGE_KEY);
  });

  it("lists every size in the guide plus a not-sure escape, in the same system as the guide", () => {
    const options = buildCheckoutFields([ring])[0].dropdown!.options;
    assert.equal(options.length, RING_SIZES.length + 1);
    assert.equal(options[0].label, "US 4 · UK H · EU 46.5");
    assert.equal(options.at(-1)!.value, "unsure");
  });

  it("asks in words, not a dropdown, when there are several rings", () => {
    const [size] = buildCheckoutFields([ring, ring]);
    assert.equal(size.type, "text");
    assert.equal(size.optional, false);
    assert.equal(size.dropdown, undefined);
  });

  it("stays inside Stripe's limits", () => {
    for (const cart of [[stone], [ring], [ring, ring]]) {
      const fields = buildCheckoutFields(cart);
      assert.ok(fields.length <= 3, "at most 3 fields");
      const keys = new Set<string>();
      for (const f of fields) {
        assert.match(f.key, /^[A-Za-z0-9]+$/, `key ${f.key}`);
        assert.ok(!keys.has(f.key), "unique keys");
        keys.add(f.key);
        assert.ok(f.label.custom.length <= 50, `label length ${f.label.custom}`);
        for (const o of f.dropdown?.options ?? []) {
          assert.match(o.value, /^[A-Za-z0-9]+$/, `option value ${o.value}`);
          assert.ok(o.label.length <= 100);
        }
        if (f.text) assert.ok(f.text.maximum_length <= 255);
      }
      const values = (fields[0].dropdown?.options ?? []).map((o) => o.value);
      assert.equal(new Set(values).size, values.length, "option values are unique");
    }
  });

  it("gives half sizes their own value, so 7 and 7.5 can't be confused", () => {
    const values = buildCheckoutFields([ring])[0].dropdown!.options.map((o) => o.value);
    assert.ok(values.includes("us7") && values.includes("us7h"));
  });
});

describe("readCheckoutFields", () => {
  const options = [
    { label: "US 7 · UK N½ · EU 54.0", value: "us7" },
    { label: "Not sure - please contact me", value: "unsure" },
  ];

  it("shows a dropdown answer by its label, not its code", () => {
    assert.deepEqual(
      readCheckoutFields([{ label: { custom: "Ring size" }, type: "dropdown", dropdown: { value: "us7", options } }]),
      [{ label: "Ring size", value: "US 7 · UK N½ · EU 54.0" }],
    );
  });

  it("reads text answers and tidies their whitespace", () => {
    assert.deepEqual(
      readCheckoutFields([{ label: { custom: "Gift message (optional)" }, type: "text", text: { value: "  Happy   birthday,\n Mum!  " } }]),
      [{ label: "Gift message (optional)", value: "Happy birthday, Mum!" }],
    );
  });

  it("skips questions left blank", () => {
    assert.deepEqual(
      readCheckoutFields([
        { label: { custom: "Gift message (optional)" }, type: "text", text: { value: null } },
        { label: { custom: "Other" }, type: "text", text: { value: "   " } },
      ]),
      [],
    );
  });

  it("copes with no fields at all", () => {
    assert.deepEqual(readCheckoutFields(undefined), []);
    assert.deepEqual(readCheckoutFields(null), []);
    assert.deepEqual(readCheckoutFields([]), []);
  });

  it("falls back to the raw value if the chosen option isn't in the list", () => {
    assert.deepEqual(
      readCheckoutFields([{ label: { custom: "Ring size" }, type: "dropdown", dropdown: { value: "us99", options } }]),
      [{ label: "Ring size", value: "us99" }],
    );
  });

  it("round-trips what buildCheckoutFields produced", () => {
    const built = buildCheckoutFields([ring]);
    // What Stripe hands back: the same field, now carrying the answer.
    const answered: AnsweredField[] = built.map((f) => ({
      label: f.label,
      type: f.type,
      ...(f.type === "dropdown"
        ? { dropdown: { options: f.dropdown!.options, value: "us7h" } }
        : { text: { value: "For Anna" } }),
    }));
    assert.deepEqual(readCheckoutFields(answered), [
      { label: "Ring size", value: "US 7.5 · UK O½ · EU 55.3" },
      { label: "Gift message (optional)", value: "For Anna" },
    ]);
  });
});
