# Dad of Diamonds

A storefront for a private collection of certified diamonds and fine jewellery.
Built with **Next.js 16**, **React 19**, **Tailwind CSS 4**, and **Stripe
Checkout**.

- Browse loose diamonds, rings, necklaces, earrings and bracelets
- Each piece is one of a kind (available / reserved / sold)
- Client-side cart → **Stripe Checkout** for payment
- Falls back to an email/WhatsApp enquiry when Stripe isn't set up yet

---

## Run it locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. It works immediately — the catalogue comes from
`src/lib/sample-products.ts` and checkout falls back to an enquiry until Stripe
keys are added.

### Environment variables

Copy `.env.example` to `.env.local` and fill in what you have. **All of them are
optional** to start.

| Variable | What it's for |
| --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Your real domain in production (used for SEO tags + Stripe redirects) |
| `STRIPE_SECRET_KEY` / `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Turn on real payments |
| `STRIPE_WEBHOOK_SECRET` | Verify Stripe webhooks (optional, for auto-marking items sold) |
| `NEXT_PUBLIC_SANITY_*` | The CMS, added later |

---

## Where things live

```
src/
  app/
    page.tsx              Home
    shop/                 Listing + ?category= filter
    product/[slug]/       Product detail
    cart/                 Cart (client) → POST /api/checkout
    success/              Post-payment confirmation
    about/  contact/      Static pages
    api/
      products/route.ts   Public catalogue feed (used by the cart)
      checkout/route.ts   Creates the Stripe Checkout session
  lib/
    site.ts               Brand name, contact details, categories  ← edit this
    products.ts           The ONLY place that reads the catalogue
    sample-products.ts    Placeholder catalogue (replace with the CMS)
    types.ts              Product shape
    cart-context.tsx      localStorage cart
  components/              Header, footer, logo, cards, gallery, forms
public/products/            Placeholder images (SVG)
```

To change the brand name, contact email, phone, WhatsApp number or currency,
edit **`src/lib/site.ts`**.

---

## Deploy to Vercel

1. Push this repo to GitHub (already done if you're reading this on GitHub).
2. Go to <https://vercel.com/new> and import the repo.
3. Framework preset: **Next.js** (auto-detected). No build settings to change.
4. Add environment variables (Project → Settings → Environment Variables) —
   at minimum `NEXT_PUBLIC_SITE_URL` set to the URL Vercel gives you.
5. Deploy. Every push to `main` redeploys automatically.

---

## Turn on payments (Stripe)

1. Create an account at <https://dashboard.stripe.com>. It's free — Stripe takes
   a per-transaction fee only. Stripe needs a registered business to accept live
   payments; **test mode** works without that.
2. Copy your keys from <https://dashboard.stripe.com/apikeys> into Vercel:
   - `STRIPE_SECRET_KEY` = `sk_test_...` (or `sk_live_...`)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_test_...`
3. Redeploy. The cart button now sends customers to Stripe's hosted checkout.
4. Test with card `4242 4242 4242 4242`, any future date, any CVC.

> In India, if Stripe onboarding is a blocker, the checkout route in
> `src/app/api/checkout/route.ts` is the only place to swap for Razorpay /
> Cashfree later.

### (Optional) Auto-mark items as sold

Add a webhook at <https://dashboard.stripe.com/webhooks> pointing to
`https://YOUR_DOMAIN/api/webhook` for the `checkout.session.completed` event,
put the signing secret in `STRIPE_WEBHOOK_SECRET`, and add a
`src/app/api/webhook/route.ts` handler that updates the product status. (Not
built yet — needs the CMS first.)

---

## Connect the CMS (so products can be edited without code)

Right now products live in `src/lib/sample-products.ts`. To let the shop owner
add and edit pieces from a dashboard:

1. `npm create sanity@latest` inside a `studio/` folder, or use Sanity's hosted
   studio. Create a **product** schema matching `src/lib/types.ts`.
2. `npm install next-sanity @sanity/image-url`
3. Replace the body of `loadProducts()` in `src/lib/products.ts` with a Sanity
   query. Nothing else changes — every page reads through that one function.
4. Add `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET` to Vercel.

---

## Scripts

| Command | Does |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
