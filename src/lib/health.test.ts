import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { healthReport } from "./health";

describe("healthReport", () => {
  it("says nothing is set up when the environment is empty", () => {
    assert.deepEqual(healthReport({}), {
      stripe: null,
      webhookSecret: false,
      cmsProject: false,
      cmsWriteToken: false,
      resend: false,
      customSender: false,
      siteUrl: null,
    });
  });

  it("tells test and live Stripe keys apart by prefix", () => {
    assert.equal(healthReport({ STRIPE_SECRET_KEY: "sk_test_abc" }).stripe, "test");
    assert.equal(healthReport({ STRIPE_SECRET_KEY: "rk_test_abc" }).stripe, "test");
    assert.equal(healthReport({ STRIPE_SECRET_KEY: "sk_live_abc" }).stripe, "live");
    assert.equal(healthReport({ STRIPE_SECRET_KEY: "something-else" }).stripe, "unknown");
  });

  it("treats blank or whitespace values as not set", () => {
    const r = healthReport({ STRIPE_SECRET_KEY: "  ", RESEND_API_KEY: "", STRIPE_WEBHOOK_SECRET: " " });
    assert.equal(r.stripe, null);
    assert.equal(r.resend, false);
    assert.equal(r.webhookSecret, false);
  });

  it("calls the sender custom only when it isn't Resend's shared test address", () => {
    assert.equal(healthReport({ RESEND_FROM: "Dad of Diamonds <onboarding@resend.dev>" }).customSender, false);
    assert.equal(healthReport({ RESEND_FROM: "Dad of Diamonds <enquiries@example.com>" }).customSender, true);
    assert.equal(healthReport({}).customSender, false);
  });

  it("reports the site address without a trailing slash", () => {
    assert.equal(healthReport({ NEXT_PUBLIC_SITE_URL: "https://example.com/" }).siteUrl, "https://example.com");
  });

  it("never leaks the value of any secret", () => {
    const secrets = {
      STRIPE_SECRET_KEY: "sk_live_SECRETKEYVALUE123",
      STRIPE_WEBHOOK_SECRET: "whsec_WEBHOOKVALUE456",
      SANITY_API_WRITE_TOKEN: "skTOKENVALUE789",
      RESEND_API_KEY: "re_RESENDVALUE000",
      NEXT_PUBLIC_SANITY_PROJECT_ID: "projid1234",
    };
    const json = JSON.stringify(healthReport({ ...secrets, RESEND_FROM: "A <a@example.com>" }));
    for (const value of Object.values(secrets)) {
      assert.ok(!json.includes(value), `leaked ${value}`);
    }
    assert.ok(!/SECRET|VALUE|TOKEN/.test(json));
  });
});
