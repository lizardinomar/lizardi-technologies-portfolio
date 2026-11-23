> **Portfolio copy.** This folder holds the storefront's front end (14 HTML pages, `.htaccess`, `robots.txt`, `sitemap.xml`, product and bundle images). Not included on purpose: the Cloudflare Worker source (`trl-worker.js`), all credentials, the signed lab PDFs and COA thumbnails (third-party documents), and the client's live form keys (replaced with `YOUR_WEB3FORMS_ACCESS_KEY`). Sections below that mention those describe the production system.

# Tropical Research Labs — trlpr.com

Bilingual (ES/EN) e-commerce storefront for a Puerto Rico-based RUO (Research Use Only) peptide distributor, with certified card payments, a cron-reconciled order ledger, and a database-driven affiliate program. Built and maintained by **Lizardi Technologies**.

- **Live:** https://trlpr.com
- **Frontend:** Static HTML/CSS/JS (no framework, no build step), hosted on Hostinger
- **Backend:** Cloudflare Worker + D1 (SQLite) for payments, order status, and affiliates
- **Payments:** Evertec / PlacetoPay WebCheckout (certified, production)

---

## Table of Contents

1. [Architecture](#architecture)
2. [Repository layout](#repository-layout)
3. [Frontend](#frontend)
4. [The payment & order backend (Cloudflare Worker)](#the-payment--order-backend-cloudflare-worker)
5. [Database schema (Cloudflare D1)](#database-schema-cloudflare-d1)
6. [Affiliate system](#affiliate-system)
7. [Catalog & bundles](#catalog--bundles)
8. [Checkout: tax, shipping, coupons](#checkout-tax-shipping-coupons)
9. [COAs (Certificates of Analysis)](#coas-certificates-of-analysis)
10. [Internationalization (i18n)](#internationalization-i18n)
11. [Legal / compliance](#legal--compliance)
12. [Security hardening](#security-hardening)
13. [Build & asset pipeline](#build--asset-pipeline)
14. [Deployment](#deployment)
15. [Environment & secrets](#environment--secrets)
16. [Known issues & TODO](#known-issues--todo)

---

## Architecture

```
┌─────────────────────────┐        ┌──────────────────────────────┐
│  Hostinger (public_html)│        │  Cloudflare                  │
│  Static site, Apache    │        │                              │
│                         │        │  Worker: trl-payments        │
│  - 14 HTML pages        │  HTTPS │   /  (create session)        │
│  - Tailwind CDN + GSAP  │ ─────► │   /status                    │
│  - Vanilla JS           │  POST  │   /webhook                   │
│  - localStorage cart    │        │   /orders                    │
│                         │        │   /affiliate/validate|login  │
│                         │        │   /admin/*                   │
└─────────────────────────┘        │   scheduled() cron */10      │
                                    │                              │
                                    │  D1: trl-orders (SQLite)     │
                                    │   transactions, affiliates,  │
                                    │   payouts                    │
                                    └───────────────┬──────────────┘
                                                    │  REST + SHA-256 auth
                                                    ▼
                                    ┌──────────────────────────────┐
                                    │  Evertec / PlacetoPay        │
                                    │  checkout.placetopay.com     │
                                    └──────────────────────────────┘
```

**Why this split:** the storefront is static for speed, cost, and simplicity (a high-risk-industry merchant with no server to maintain). Everything that needs a secret (payment credentials), durability (order ledger), or server-side verification (webhook signatures, payment status) lives in the Cloudflare Worker. The browser never sees payment credentials and never holds authoritative order state.

**Data flow for a card order:**
1. Browser builds cart in `localStorage`, computes subtotal + IVU + shipping client-side.
2. Checkout `POST`s to the Worker `/` endpoint with reference, total, buyer info, and (if used) affiliate code + commission base.
3. Worker authenticates to PlacetoPay with a per-request SHA-256 `tranKey`, creates a session, writes a `PENDING` row to D1, and returns the hosted `processUrl`.
4. Browser redirects to PlacetoPay's hosted page (PCI scope stays with Evertec — card data never touches our site or Worker).
5. On return, `gracias.html` queries `/status` for the real transaction state.
6. Independently, PlacetoPay calls `/webhook` (signature-verified) and a `*/10 * * * *` cron sweeps `PENDING` rows to reconcile final status.

---

## Repository layout

```
trl-website/
├── index.html              # Home / hero
├── catalogo.html           # Catalog: products array, bundles, cart, modals
├── checkout.html           # Cart review, IVU, shipping, coupon, payment init
├── gracias.html            # Post-payment status (queries Worker /status)
├── coas.html               # Certificates of Analysis gallery + modal viewer
├── afiliados.html          # Affiliate program info + application form
├── panel.html              # Affiliate + admin dashboard (login, stats, payouts)
├── about.html              # Company / RUO positioning
├── contacto.html           # Contact form (Web3Forms) + WhatsApp
├── disclaimer.html         # Legal: RUO / FDA / 503A-503B
├── terminos.html           # Legal: terms & conditions
├── privacidad.html         # Legal: privacy (CCPA)
├── envios.html             # Legal: shipping policy
├── accesibilidad.html      # Accessibility statement (WCAG 2.1 AA)
├── robots.txt
├── sitemap.xml
├── .htaccess               # Apache: HSTS, CSP, caching, header hardening
└── assets/
    ├── images/
    │   ├── vials/          # [productId].jpg  (per-product vial photos)
    │   └── bundles/        # bundle-*.jpg     (promo images)
    └── docs/
        └── coas/
            ├── [id].pdf          # per-product signed COA
            └── thumbs/[id].png   # 464×600 first-page thumbnail

trl-worker.js               # Cloudflare Worker source (deploy separately)
```

> The Worker (`trl-worker.js`) is deployed to Cloudflare, not served from Hostinger. It is kept in the repo for version control.

---

## Frontend

- **Stack:** HTML5, CSS3, vanilla ES6+ JavaScript. No framework, no bundler, no transpile step. Each page is fully self-contained and independently deployable.
- **CSS:** Tailwind via CDN for utilities, plus hand-written CSS using custom properties (design tokens) for the brand system.
- **Animation:** GSAP + ScrollTrigger for scroll reveals; a custom cursor; parallax orbs.
- **Type:** Google Fonts — Bebas Neue (display), Space Mono (technical/mono detail), Inter (body).
- **State:** cart persisted in `localStorage` under `trl_cart`; language preference persisted; coupon state in memory.
- **No server rendering.** All dynamic behavior (catalog render, cart, modals, i18n, totals) runs client-side.

### Brand system (design tokens)

| Token | Value | Use |
|---|---|---|
| `--void` | `#050810` | near-black background base |
| `--navy` | `#0A1628` | primary surface |
| `--teal` | `#00D4AA` | primary accent |
| `--coral` | `#FF6B47` | secondary accent / warnings / CTAs |
| `--bone` | `#E8E4D9` | primary text on dark |

### Cross-browser safety patch (every page)

A defensive CSS block ships on every page to prevent layout breakage on Android Chrome and Firefox:

```css
* { min-width: 0 }           /* prevent flex/grid overflow blowouts */
html, body { overflow-x: hidden; text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }
```

### Navigation

- Desktop: fixed top nav with links to Catálogo, COAs, About, Contacto, **Panel** (affiliate login).
- Mobile (<900px): the desktop nav is hidden with `!important` (to beat Tailwind's `flex`), replaced by a hamburger button opening a fullscreen overlay menu. Menu items are bilingual via `data-es`/`data-en`.

---

## The payment & order backend (Cloudflare Worker)

**File:** `trl-worker.js` · **Name:** `trl-payments` · **URL:** `https://trl-payments.tropicalresearchlabs.workers.dev`

ES module Worker exporting `fetch` (HTTP) and `scheduled` (cron) handlers. All responses carry permissive CORS (the static site is a different origin).

### PlacetoPay authentication

Every request to PlacetoPay carries a freshly computed auth object:

```
nonce   = 16 random bytes
seed    = ISO-8601 timestamp
tranKey = Base64( SHA-256( nonce_bytes ‖ seed ‖ P2P_SECRET ) )
```

Implemented with Web Crypto (`crypto.getRandomValues`, `crypto.subtle.digest`). The secret never leaves the Worker; the browser never sees it.

### Endpoints

| Method | Path | Purpose |
|---|---|---|
| `POST` | `/` | Create a PlacetoPay session. Validates reference/total, clamps session expiration to 10–30 min, writes a `PENDING` transaction to D1 (with `affiliate_code` + `commission_base` when present), returns `processUrl`. |
| `POST` | `/status` | Returns the real transaction status. Reads D1 first; if still `PENDING`, queries PlacetoPay `/api/session/{requestId}` live and updates D1. |
| `POST` | `/webhook` | PlacetoPay async notification. Verifies `SHA-256(requestId + status + date + secret)` signature before trusting; updates the matching transaction. |
| `GET` | `/orders` | Returns the 200 most recent transactions (admin/debug view). |
| `POST` | `/affiliate/validate` | Checkout coupon check: `{code}` → `{valid, discount, affiliate}` if the code exists and is active. |
| `POST` | `/affiliate/login` | `{code, pin}` → that affiliate's stats + payout history (own data only). |
| `POST` | `/admin/affiliates` | (PIN-gated) list every affiliate with computed balances. |
| `POST` | `/admin/add-affiliate` | (PIN-gated) create an affiliate (`code`, `name`, `pin`, optional `discount`/`commission`). |
| `POST` | `/admin/toggle-affiliate` | (PIN-gated) activate/deactivate a code. |
| `POST` | `/admin/payout` | (PIN-gated) record a payout (reduces balance owed). |
| `POST` | `/admin/manual-sale` | (PIN-gated) insert an `APPROVED` transaction for an off-platform (ATH/crypto) sale so its commission counts. |

All `/admin/*` endpoints require `body.adminPin === env.ADMIN_PIN` and return `401` otherwise.

### Evertec certification (production) — what was implemented

The integration passed Evertec's formal certification. The five required behaviors:

1. **Session expiration** — parameterized, clamped server-side to 10–30 min (default 30).
2. **Real transaction status** — `gracias.html` shows the actual state from a live `/status` query (never assumes success), with a D1 fallback.
3. **Phone field validation** — format-validated client-side with `setCustomValidity`.
4. **Scheduled probe** — Cloudflare Cron Trigger `*/10 * * * *` runs `scheduled()`, which reconciles `PENDING` transactions from the last 24h against PlacetoPay.
5. **Webhook** — public endpoint with SHA-256 signature verification, persisting status to D1.

---

## Database schema (Cloudflare D1)

**Database:** `trl-orders` · **Binding:** `DB`

```sql
-- Card (and manual) transactions
CREATE TABLE transactions (
  reference       TEXT PRIMARY KEY,
  request_id      TEXT,
  status          TEXT,              -- PENDING | APPROVED | REJECTED
  amount          REAL,
  buyer_email     TEXT,
  buyer_name      TEXT,
  message         TEXT,
  affiliate_code  TEXT,              -- added for affiliate attribution
  commission_base REAL,             -- subtotal-after-discount the commission is computed on
  created_at      TEXT DEFAULT (datetime('now')),
  updated_at      TEXT
);

-- Affiliates (codes live in the DB, not in page source)
CREATE TABLE affiliates (
  code        TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  pin         TEXT NOT NULL,
  discount    REAL DEFAULT 0.10,     -- customer discount (10%)
  commission  REAL DEFAULT 0.05,     -- affiliate commission (5%)
  active      INTEGER DEFAULT 1,
  created_at  TEXT DEFAULT (datetime('now'))
);

-- Payouts Carlos records when he pays an affiliate
CREATE TABLE payouts (
  id              INTEGER PRIMARY KEY AUTOINCREMENT,
  affiliate_code  TEXT NOT NULL,
  amount          REAL NOT NULL,
  note            TEXT,
  paid_at         TEXT DEFAULT (datetime('now'))
);
```

Transactions use an upsert pattern (`INSERT ... ON CONFLICT(reference) DO UPDATE`). Prepared statements throughout (`.prepare().bind().run()/.first()/.all()`).

> **Binding gotcha:** the D1 binding **must** be named `DB` to match the Worker code (`env.DB`). An earlier misname (`D8`) produced `Cannot read properties of undefined (reading 'prepare')`.

---

## Affiliate system

Database-driven, manual-payout model. Codes are **not** hardcoded in page source — they live in D1 and are managed through `panel.html`.

- **Economics:** 10% customer discount, 5% affiliate commission.
- **Commission base:** `subtotal − discount` (pre-IVU, pre-shipping), stored per transaction as `commission_base`.
- **Balance owed:** `SUM(commission_base of APPROVED txns) × commission_rate − SUM(payouts)`.

### `panel.html` — two roles, one page

- **Affiliate view:** logs in with `code + PIN`; sees only their own four stats (sales count, commission earned, already paid, **balance owed**) plus payout history.
- **Admin view (Carlos):** logs in with the admin PIN; sees every affiliate and balance; can add affiliates, toggle active state, register payouts, and register manual sales (for ATH/crypto orders that bypass the card flow).

Self-contained page (own CSS in TRL brand palette), Spanish-primary. The admin PIN is verified server-side against the `ADMIN_PIN` Worker secret — it is never in page source.

### Checkout integration

`applyCoupon()` is async: it `POST`s the entered code to `/affiliate/validate`. On success it applies the discount and stashes the affiliate code; at payment init the code and `commissionBase` ride along in the session `POST` so the transaction row is attributed.

---

## Catalog & bundles

### Products

`catalogo.html` holds the single source of truth: a `PRODUCTS` array of objects. The checkout reads prices from the cart (`localStorage`), which is populated from this array — so **prices are edited in one place**.

Product shape:

```js
{
  id:'tz', name:'TRL-2 TZ', sub:'…', cat:'Metabólico', isNew:true,
  sizes:[{size:'10mg',price:44.84},{size:'30mg',price:67.26}],
  cas:'…', formula:'…', mw:'…',
  pureza:'…', ap:'…', store:'…', hl:'…', syn:'…',
  desc:'… Para uso exclusivo en investigación (RUO).'
}
```

- **39 products** across categories: Metabólico, GH/IGF, Longevidad, Reparación, Piel/Cabello, Neuro, **Bioregulador**, **Otros**, Suministros.
- Images resolve by id: `assets/images/vials/[id].jpg` (with a CSS fallback if missing).
- Price rendering splits dollars and **always-two-digit** cents (`$58` + `.30`), never appends `.00`.

### Bundles

A dedicated bundles section renders from a `BUNDLES` array (4 bundles: Starter TZ10 $89, Starter RT10 $99, Aggressive TZ30 $109, Elite TZ60 $129). Each opens a modal listing contents with an optional **+$10 Fat Blaster** upsell toggle that updates the total live. A bundle enters the cart as a single line item carrying `bundleName`; with/without upsell are distinct cart ids (`bundle-x` vs `bundle-x-fb`). Cart, checkout, and the WhatsApp order message are all bundle-aware (they read `bundleName` rather than a product lookup).

---

## Checkout: tax, shipping, coupons

### IVU (Puerto Rico sales tax)

- **11.5%**, auto-applied when the country field is `PR`.
- The country `<select>` is **strict**: it starts on a disabled `"Selecciona tu ubicación"` placeholder and is `required`, so a customer cannot leave a stale default and skip IVU. Totals recompute on every change, so re-selecting PR re-adds IVU.

### Shipping (country-aware)

| Method | Puerto Rico | US / territories / intl |
|---|---|---|
| Standard | **FREE** | $14.00 |
| Priority Mail | $18.00 | $18.00 |
| Pickup | $0.00 | $0.00 |

The standard option renders PR and US as two explicit labeled rows (🇵🇷 FREE / 🇺🇸 $14) to avoid ambiguity. There is **no free shipping anywhere else** in the system.

### Order IDs

Generated as `timestamp base-36 + random` to avoid collisions (an earlier `localStorage` counter produced duplicate `TRL-2026-0001` ids for every buyer).

### PlacetoPay gotchas encoded here

- Payment `description` must be plain (`Orden ${orderId}`) — em-dashes/special chars trigger a `description` rejection.
- Test endpoint only accepts test cards; a real card returns `XR`. Production credentials were issued only after certification evidence was approved.

---

## COAs (Certificates of Analysis)

`coas.html` renders a `COAS` array into a filterable gallery with a modal viewer.

- **28 COAs** on the page. Each entry: `{id, name, cat, lot, purity, date, report}`.
- Each links a signed PDF at `assets/docs/coas/[id].pdf` and shows a first-page thumbnail at `assets/docs/coas/thumbs/[id].png` (464×600).
- Filterable by category (including Bioregulador and Otros).
- Lab: BTLabs (West Palm Beach, FL). Reports are FTIR + HPLC identity/purity/potency.

---

## Internationalization (i18n)

Custom, dependency-free. Elements carry `data-es` / `data-en` (and `data-es-html` / `data-en-html` for rich content). `applyLanguage(lang)` swaps text and persists the choice in `localStorage`. A header toggle flips the whole site; Spanish is primary.

---

## Legal / compliance

Required by the client brief and shipped on the site:

- **RUO framing throughout:** every product and the footer carry "Research Use Only · Not for Human Use" (ES + EN).
- **FDA / 503A-503B disclaimer** on the disclaimer page and footer: TRL is a distributor, not a 503A pharmacy or 503B outsourcing facility; products are not FDA-evaluated.
- **Dedicated legal pages:** disclaimer, terms, privacy (CCPA), shipping.
- **Positioning:** TRL is described as a **distributor/reseller** of third-party RUO compounds — never as a manufacturer, synthesizer, or "research laboratory."
- Domain is `trlpr.com` everywhere; public phone/WhatsApp `939-599-1835`.

> Compliance copy is business-critical and client-reviewed; treat changes to legal pages and product descriptions as requiring client sign-off.

---

## Security hardening

Via `.htaccess` (Apache) and Worker design:

- **HSTS** (`Strict-Transport-Security`).
- **CSP** (`Content-Security-Policy`) with scoped `script-src`, `frame-ancestors`, `form-action`.
- `X-Content-Type-Options`, `X-Frame-Options`, `Referrer-Policy`, `Permissions-Policy`.
- Infra-revealing headers removed (`X-Powered-By`, etc.).
- `mod_deflate` compression + `mod_expires` caching.
- **Secrets** (`P2P_LOGIN`, `P2P_SECRET`, `ADMIN_PIN`) live only as Cloudflare Worker secrets — never in client code or the repo.
- Web3Forms access keys are public by design (client-side form keys); no sensitive keys are exposed.
- Card data is **never** handled by our site or Worker (PCI scope stays with PlacetoPay's hosted page).

---

## Build & asset pipeline

No JS build step. The only "build" is asset processing:

- **Vial images:** processed with Python/Pillow (shadow lift, brightness, white balance, contrast, saturation, unsharp mask, vignette), then exported as progressive JPEG. A representative batch went from ~104MB of source PNGs to ~1.6MB (2048² PNG → 1024² JPEG q88) with no perceptible loss.
- **COA thumbnails:** generated from each PDF's first page with `pdftoppm`, resized to 464×600 PNG.
- **Distribution:** the site folder is zipped for drag-and-drop deployment.

---

## Deployment

### Static site (Hostinger)

1. Upload the **contents** of `trl-website/` into `public_html` (not the folder itself).
2. `assets/` must come along (images, COAs, thumbnails).
3. Hard-refresh (Ctrl/Cmd+Shift+R) to clear cached pages after an update.

Any single page can be updated in isolation (they share no build artifacts). Prices change only `catalogo.html`; adding a product that can enter the cart also touches `checkout.html`'s `PRODUCT_NAMES` map.

### Worker (Cloudflare)

1. Paste `trl-worker.js` into the `trl-payments` Worker → **Deploy**.
2. Ensure the D1 binding `DB` → `trl-orders` exists.
3. Ensure the Cron Trigger `*/10 * * * *` is active.
4. Secrets must be set (below). **Secrets only take effect after a Deploy.**

---

## Environment & secrets

Set as **Cloudflare Worker secrets** (Settings → Variables and Secrets):

| Name | Purpose |
|---|---|
| `P2P_LOGIN` | PlacetoPay login (production) |
| `P2P_SECRET` | PlacetoPay secret key (production) |
| `ADMIN_PIN` | Affiliate-panel admin PIN |

Bindings:

| Binding | Resource |
|---|---|
| `DB` | D1 database `trl-orders` |

Worker constant: `ENDPOINT = "https://checkout.placetopay.com"` (production; test is `checkout-test.placetopay.com`).

Public (client-side, non-sensitive): Web3Forms access keys for the contact, checkout, and affiliate forms.

---

## Known issues & TODO

- [ ] **12 new product vial images** not yet added: `ara290, dihexa, thymalin, adamax, cortagen, vesugen, lipofocus, lipob, lemonbottle, klow, pt141, vip` (`assets/images/vials/[id].jpg`). Products render with a fallback until added.
- [ ] **Remove `/debug-pin`** route from the Worker (temporary diagnostic added while debugging the admin PIN; harmless but should not stay in production).
- [ ] **COA lot-number error (upstream):** the Retatrutide 30mg COA (`rt30.pdf`, report COA261128-004) shows lot `TZ-260700-01` (a Tirzepatide prefix). BTLabs document error — needs reissue by the lab.
- [ ] **ATH Móvil Payment Button** (automatic, server-verified) not yet built. Current ATH flow is manual and unverified; interim mitigation is to mark ATH orders as "payment pending — verify in ATH Business before shipping." Build needs Carlos's ATH Business public + private tokens (~7–10h; no card recertification required).
- [ ] Verify the production PlacetoPay endpoint + credentials are the deployed ones (not test) before taking live card orders.

---

*Maintained by Lizardi Technologies · Puerto Rico*
