# Dad of Diamonds

A storefront for a private collection of certified diamonds and fine
jewellery — built with **Next.js 16**, **React 19**, **Tailwind CSS 4**,
**Sanity** (CMS), **Stripe** (payments) and **Resend** (enquiries).

**Live site:** https://dad-of-diamonds.vercel.app
**Admin (CMS):** https://dad-of-diamonds.vercel.app/studio

![Homepage hero](docs/screenshots/home.png)

---

## What's in the box

- **Full storefront** — home, shop (filterable by category, sortable by
  price/carat), product detail (with "you may also like"), cart, wishlist,
  about, contact, and a diamond-buying guide. Every piece is one of a kind:
  available / reserved / sold.
- **Wishlist** — a heart on every product card and the product page saves a
  piece to a `/wishlist` page (localStorage, synced across tabs), with a
  live count badge in the header.
- **Share** — WhatsApp, native share sheet (on supported devices), and copy
  link on every product page.
- **Photo lightbox** — click any product photo for a full-screen view, with
  keyboard (Esc / arrow keys) and on-screen navigation between shots.
- **New-arrivals signup** — a footer email capture that notifies the shop
  owner of every subscriber via the same Resend pipeline as enquiries.
- **Diamond guide** — a plain-English "Understanding the 4 Cs" page
  (carat/cut/colour/clarity + why certification matters), linked from the
  footer and from every diamond's spec table.
- **Search** — a header search box with live suggestions (name, summary,
  category) as you type, and a full results page at `/shop?q=`.
- **Trust badges** — certified / secure checkout / insured delivery, shown
  next to the buy buttons on every product page and in the footer.
- **Make an offer** — a negotiate link next to Reserve/Add to cart that opens
  the enquiry form pre-filled with the piece and a place to name a price.
- **Testimonials** — a homepage section for client quotes. Ships with
  bracketed placeholder copy (`[Add a client quote here]`) — replace with
  real feedback before relying on it as social proof; see [Add real
  testimonials](#add-real-testimonials) below.
- **Recently viewed** — a homepage strip of pieces the visitor already
  looked at (localStorage, same pattern as the cart and wishlist).
- **FAQ** — certification, reserving, delivery, resizing, returns — answers
  to the questions most likely to block a purchase, at `/faq`.
- **Diamond comparison** — a compare icon on every diamond's card (and a
  button on its product page) adds it to a floating tray, up to 3 at a
  time, with a `/compare` page showing price/carat/cut/colour/clarity/
  certificate side by side.
- **Ring size guide** — a US/UK/EU conversion chart plus two ways to
  measure at home, at `/size-guide`, linked from the FAQ and every ring.
- **Privacy Policy & Terms of Sale** — plain-language pages at `/privacy`
  and `/terms`, linked in the footer. They describe what the site actually
  does (grounded in the code — what's emailed vs. stored only in your
  browser, what Stripe collects, etc.), not invented legal boilerplate;
  worth a professional review before relying on them, see the note in
  ["Legal pages"](#legal-pages) below.
- **FAQ structured data** — the FAQ page emits schema.org `FAQPage`
  JSON-LD, so its answers are eligible for Google rich results.
- **Shop filters** — price range, plus shape, colour and clarity for
  diamonds (colour/clarity are "or better" thresholds). They live in the URL
  (`?price=5000-10000&shape=Oval&color=G&clarity=VS2`), combine with category,
  search and sort, and shapes are read from the catalogue so the list never
  goes stale.
- **Drop a hint** — the wishlist page can share the saved list by WhatsApp,
  the native share sheet or a copied link, with an optional sender name. The
  link itself carries the piece slugs (`/wishlist/shared?items=…&from=…`) so
  nothing is stored anywhere; the shared page is `noindex`.
- **Piece alerts** — reserved and sold pieces show an "Alert me" email form
  (reserved: "if it becomes available again"; sold: "when something similar
  arrives"). It reuses `/api/subscribe`, emailing the owner the piece link.
- **Instagram** — a "Follow along" strip on the homepage and a footer link,
  both driven by `SITE.instagram` in `src/lib/site.ts`.
- **A real CMS** (Sanity, embedded at `/studio`) — add, edit and photograph
  pieces from a dashboard, no code. Falls back to sample data until it's
  connected, so the site is never broken.
- **Real checkout** (Stripe) — the cart creates a hosted Stripe Checkout
  session and re-prices everything server-side. Falls back to an email /
  WhatsApp enquiry until Stripe is configured.
- **Reliable enquiries** (Resend) — the contact form and "Send enquiry" email
  the shop owner directly, reply-to set to the customer, with honeypot +
  timing spam protection. Falls back to opening the visitor's own email app
  if it isn't configured.
- **A luxury motion layer, built with plain CSS, consistent site-wide** —
  scroll reveals, a cursor-tracking "jeweler's loupe" on product photos,
  twinkling sparkles, a gold light sweep across the headline, hover lifts,
  and a self-drawing diamond mark on empty/confirmation states (404, empty
  cart, order confirmed). No animation library; everything respects
  `prefers-reduced-motion`.
- **SEO** — sitemap, robots.txt, per-page metadata, Open Graph tags, and
  `Product` / `Organization` / `WebSite` structured data (schema.org
  JSON-LD) so pieces are eligible for Google rich results.
- **Analytics** — Vercel Web Analytics, privacy-friendly, no cookie banner
  needed.

|                                         Shop                                          |                                       Product page                                        |
| :-------------------------------------------------------------------------------------: | :------------------------------------------------------------------------------------: |
| ![Shop grid](docs/screenshots/shop.png) | ![Product detail](docs/screenshots/product.png) |

|                                           Admin (Sanity Studio)                                            |
| :----------------------------------------------------------------------------------------------------: |
| ![Sanity Studio login](docs/screenshots/studio.png) |

---

## Run it locally

```bash
npm install
npm run dev
```

Open <http://localhost:3000>. It works immediately with **zero configuration**
— the catalogue comes from `src/lib/sample-products.ts`, checkout falls back
to an enquiry, and the enquiry form falls back to opening your email app.
Nothing is required to start developing.

### Environment variables

Copy `.env.example` to `.env.local` and fill in what you have — **every one of
them is optional**; each feature degrades gracefully without it (see the
setup guides below for each).

| Variable | For | Vercel type |
| --- | --- | --- |
| `NEXT_PUBLIC_SITE_URL` | Absolute URLs — SEO tags, Stripe redirects | Config |
| `NEXT_PUBLIC_SANITY_PROJECT_ID` / `NEXT_PUBLIC_SANITY_DATASET` | The CMS (catalogue + `/studio`) | Config |
| `SANITY_API_WRITE_TOKEN` | One-time: `npm run seed` only, never deployed | — (local only) |
| `STRIPE_SECRET_KEY` | Real payments | **Secret** |
| `STRIPE_WEBHOOK_SECRET` | Auto-marking items sold (optional, not yet wired up) | **Secret** |
| `RESEND_API_KEY` | Enquiry emails | **Secret** |
| `RESEND_FROM` | Custom sender once a domain is verified in Resend | Config |

> **Vercel note:** anything prefixed `NEXT_PUBLIC_` must be added as type
> **Config**, not Secret — Secret values can't be read back into the client
> bundle. Real secrets (`STRIPE_SECRET_KEY`, `RESEND_API_KEY`) should be
> **Secret**.

---

## Where things live

```
src/
  app/
    (site)/                 Every page that shares the header/footer
      page.tsx                Home
      shop/                   Listing + ?category=, ?sort=, ?q=, ?price= ?shape=
                             ?color= ?clarity= filters
      wishlist/shared/        Read-only page for a shared "hint" link
      product/[slug]/         Product detail
      cart/                   Cart (client) → POST /api/checkout
      success/                Post-payment confirmation
      about/  contact/        Static pages
      guide/                  "Understanding the 4 Cs" diamond guide
      faq/                    Certification, delivery, resizing, returns
      compare/                Client page — side-by-side diamond comparison
      size-guide/             Ring size conversion chart + measuring tips
      privacy/  terms/        Plain-language legal pages (not legal advice
                             — see "Legal pages" below)
    studio/[[...tool]]/     Embedded Sanity Studio at /studio
    api/
      products/route.ts      Public catalogue feed (used by the cart)
      checkout/route.ts      Creates the Stripe Checkout session
      enquiry/route.ts       Sends contact-form / cart / offer enquiries via
                             Resend
      subscribe/route.ts     Sends new-arrivals signups and piece alerts via
                             Resend
    layout.tsx              Root layout (fonts, metadata) — no header/footer
    globals.css             Theme tokens + all motion/animation CSS
  sanity/
    schemaTypes/product.ts  The CMS schema
    lib/                    Sanity client + GROQ queries
    env.ts                  Reads NEXT_PUBLIC_SANITY_* (soft — never throws)
  lib/
    site.ts                 Brand name, contact details, categories  ← edit this
    products.ts             The ONLY place that reads the catalogue
                             (incl. getRelatedProducts, sortProducts)
    search.ts                searchProducts — pure, used server + client
    filters.ts               filterProducts + option lists — pure, shared by
                             the shop page and the ShopFilters controls
    sample-products.ts      Offline fallback catalogue
    types.ts                Product shape
    cart-context.tsx        localStorage cart (useSyncExternalStore)
    wishlist-context.tsx    localStorage wishlist — same pattern as the cart
    recently-viewed-context.tsx  localStorage view history — same pattern
    compare-context.tsx     localStorage compare list, capped at 3 — same
                             pattern
    use-catalog.ts          Fetches /api/products — shared by cart, wishlist
                             and the header search box
    stripe.ts / resend.ts   Lazy clients — null until configured
    use-loupe.ts            Shared cursor-spotlight hook
    json-ld.ts              schema.org Product/Organization/WebSite/FAQPage
                             builders
  components/               Header, footer, logo, cards, gallery, forms,
                             Reveal (scroll-in), Sparkles, HeroShowcase,
                             WishlistButton, ShareButtons, Lightbox,
                             NotifyForm, SortSelect, SearchBox,
                             TrustBadges, Testimonials, RecentlyViewed,
                             RecordView, CompareButton, CompareTray,
                             InstagramStrip, ShopFilters, WishlistHint,
                             JsonLd
scripts/
  seed-sanity.mts           Loads the 12 starter pieces + photos into Sanity
public/products/            Starter product photography (licensed stock)
docs/screenshots/           Images used in this README
```

To change the brand name, contact email, phone, WhatsApp number or currency,
edit **`src/lib/site.ts`**.

---

## Deploy to Vercel

1. Push this repo to GitHub (already done if you're reading this there).
2. Go to <https://vercel.com/new> and import the repo.
3. Framework preset: **Next.js** (auto-detected). No build settings to change.
4. Add environment variables (Project → Settings → Environment Variables) —
   see the table above for which type each one needs.
5. Deploy. Every push to `main` redeploys automatically.

---

## Turn on payments (Stripe)

1. Create an account at <https://dashboard.stripe.com>. It's free — Stripe takes
   a per-transaction fee only. Stripe needs a registered business to accept live
   payments; **test mode** works without that.
2. Copy your **secret** key from <https://dashboard.stripe.com/apikeys> into
   Vercel as `STRIPE_SECRET_KEY` (type **Secret**) = `sk_test_...` (or
   `sk_live_...`). The publishable key isn't used — checkout is Stripe's
   hosted page, not their JS widget.
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

## Reliable enquiries (Resend)

The contact form and the cart's "Send enquiry" button both post to
`src/app/api/enquiry/route.ts`, which emails the enquiry straight to
`SITE.email` (see `src/lib/site.ts`), reply-to set to the customer's address.
Until it's configured, the form shows a message and falls back to opening the
visitor's own email app — so nothing is broken either way, but a configured
form is far less likely to lose a lead. A hidden honeypot field and a
minimum-time check filter out bot submissions silently.

1. Create a free account at <https://resend.com> — **use the same email
   address as `SITE.email`**. Without a verified sending domain, Resend only
   delivers to the address the account itself was created with, so this keeps
   it working immediately.
2. **API Keys → Create API Key** → copy it.
3. Add to Vercel: `RESEND_API_KEY` (type **Secret**).
4. Redeploy. Submit the contact form to test — the email arrives with the
   customer's address set as reply-to, so you can just hit reply.

To send from your own domain later (e.g. `enquiries@dadofdiamonds.com`
instead of `onboarding@resend.dev`) and deliver to any address: verify the
domain under **Domains** in Resend, then set `RESEND_FROM` in Vercel to
`Dad of Diamonds <enquiries@yourdomain.com>`.

---

## Add real testimonials

The homepage's "What clients say" section (`src/components/testimonials.tsx`)
ships with three placeholder entries, deliberately written in brackets —
`[Add a client quote here]` — so it's obvious the copy is unfinished rather
than reading as a genuine review if it's ever seen live. Nothing was
invented: no fake names or quotes were written in, because presenting made-up
reviews as real would be misleading to buyers on a site selling four- and
five-figure pieces.

To make it real, open `src/components/testimonials.tsx` and edit the
`TESTIMONIALS` array — each entry is just `{ quote, name, detail }`. Good
sources: a WhatsApp or email message from a past buyer (ask permission to
quote them), or a short line dictated over a call. First name + last initial
(e.g. `"Sarah M."`) is the usual convention if a client would rather not use
their full name.

---

## Legal pages

`/privacy` and `/terms` (`src/app/(site)/privacy/page.tsx`,
`src/app/(site)/terms/page.tsx`) are plain-language pages that describe how
the site actually behaves — what's emailed to the owner vs. kept only in
your browser's local storage, what Stripe collects during checkout, the
one-of-a-kind/case-by-case returns approach already stated on the FAQ, and
so on. Every claim on them is grounded in what the code actually does; none
of it was invented.

They are **not** a substitute for real legal advice. Before relying on
these as binding terms — especially once live payments are enabled, or for
customers in jurisdictions with specific consumer-protection or data-privacy
requirements (e.g. GDPR, given the German contact number in `SITE.phone`) —
have them reviewed by a lawyer familiar with the applicable rules. Update
the pages directly; there's no CMS integration for this content.

---

## Connect the CMS (Sanity)

The Studio is **already built** — it lives at `/studio` and the schema is in
`src/sanity/schemaTypes/product.ts`. It just needs a Sanity project to point at.
Until then the site serves `src/lib/sample-products.ts` and `/studio` shows a
setup notice.

### 1. Create a free Sanity project

1. Go to <https://www.sanity.io/manage> → sign in with Google/GitHub
2. **Create new project** → name it "Dad of Diamonds"
3. Dataset: **production** (public)
4. Copy the **Project ID** shown on the dashboard

### 2. Allow your site to talk to Sanity (CORS)

In the project dashboard → **API → CORS origins → Add origin**:

- `http://localhost:3000` (check "Allow credentials")
- your Vercel URL, e.g. `https://dad-of-diamonds.vercel.app` (check "Allow credentials")

### 3. Add the env vars

Locally (`.env.local`) **and** in Vercel (type **Config**, see table above):

```
NEXT_PUBLIC_SANITY_PROJECT_ID=your-project-id
NEXT_PUBLIC_SANITY_DATASET=production
```

Redeploy on Vercel. Now `/studio` loads the real editor (sign in with the same
Sanity account).

### 4. (Optional) Load the 12 starter pieces

1. In Sanity dashboard → **API → Tokens → Add token** → name "seed", role
   **Editor** → copy it
2. Add to `.env.local`: `SANITY_API_WRITE_TOKEN=your-token`
3. Run:
   ```bash
   npm run seed
   ```
4. Open `/studio`, replace the placeholder images with real photos, delete any
   pieces you don't want.

> The token is only for this one script — don't put it in Vercel. Delete it
> from Sanity once you're done seeding (this project's token has already been
> rotated out).

---

## The motion layer

Everything is plain CSS + a couple of small hooks — no animation library:

- **`<Reveal>`** (`src/components/reveal.tsx`) — fades + rises content into
  view on scroll. Checks synchronously whether an element is already on
  screen (so above-the-fold content, like the price and buy button, never
  waits on an animation) and has a 2-second safety fallback so nothing can
  get stuck invisible.
- **`useLoupe`** (`src/lib/use-loupe.ts`) — the cursor-tracking spotlight used
  on the hero showcase and the product gallery. Pair with the `.cursor-light`
  class.
- **`<Sparkles>`** (`src/components/sparkles.tsx`) — the twinkling stars in
  the hero.
- Headline shimmer, hero entrance, hover lifts, and the diamond mark's
  "self-draw" (`<DiamondMark draw />`) all live as utility classes in
  `src/app/globals.css`.

Every page uses the same building blocks, not just the homepage: cart rows
and the empty-cart state, the about/contact pages (reveal + a faint diamond
watermark), the checkout confirmation, and both 404 pages all reuse `<Reveal>`
and `<DiamondMark />` rather than one-off styling.

All of it is wrapped in `@media (prefers-reduced-motion: no-preference)`, so
visitors who've asked for reduced motion get a fully static, still-complete
site.

---

## SEO & analytics

- **Structured data** (`src/lib/json-ld.ts`, rendered by
  `src/components/json-ld.tsx`) — every product page carries schema.org
  `Product` + `Offer` markup (price, availability, images, the 4 Cs), and
  every page carries `Organization` + `WebSite`. Check any live product URL
  in [Google's Rich Results Test](https://search.google.com/test/rich-results)
  to see it parsed.
- **`sitemap.ts`** / **`robots.ts`** — already wired to the live catalogue.
- **Analytics** — [Vercel Web Analytics](https://vercel.com/docs/analytics)
  via `@vercel/analytics`. The `<Analytics />` component in the root layout
  only activates on Vercel's production environment (it's intentionally
  silent locally), so there's nothing to configure in code — just turn it on
  once for the project: **Vercel dashboard → your project → Analytics tab →
  Enable**. It's free on the Hobby plan up to a monthly event limit.

---

## Scripts

| Command | Does |
| --- | --- |
| `npm run dev` | Local dev server |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run seed` | Load the 12 starter pieces into Sanity (needs a write token) |

---

## Status

| Area | Status |
| --- | --- |
| Storefront | ✅ Live |
| CMS | ✅ Live — 12 pieces seeded |
| Payments | ✅ Live (Stripe **test mode**) |
| Enquiries | ✅ Live |
| SEO structured data | ✅ Live |
| Analytics | ✅ Code shipped — enable in the Vercel dashboard (see above) |
| "You may also like" | ✅ Live |
| Design polish (motion + visuals site-wide) | ✅ Live |
| Wishlist | ✅ Live |
| Share buttons | ✅ Live |
| Photo lightbox | ✅ Live |
| New-arrivals signup | ✅ Live |
| Shop sort (price/carat) | ✅ Live |
| Diamond guide (4 Cs) | ✅ Live |
| Search | ✅ Live |
| Trust badges | ✅ Live |
| Make an offer | ✅ Live |
| Testimonials | ⚠️ Placeholder copy — needs real client quotes |
| Recently viewed | ✅ Live |
| FAQ | ✅ Live |
| Diamond comparison | ✅ Live |
| Ring size guide | ✅ Live |
| Privacy Policy & Terms | ⚠️ Live, but needs a legal review — see "Legal pages" |
| FAQ structured data | ✅ Live |
| Shop filters | ✅ Live |
| Drop a hint (wishlist sharing) | ✅ Live |
| Piece alerts (reserved/sold) | ✅ Live |
| Instagram strip | ✅ Live |
| Custom domain | Owner-managed, not part of this repo's deploy |

**Not yet built:** live (real-money) Stripe mode, and the sold-item webhook.
