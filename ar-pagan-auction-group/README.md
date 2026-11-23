# A.R. Pagán Auction Group

**Live:** launching at [arpagan.com](https://arpagan.com) (final domain cutover pending)
**Client:** A.R. Pagán Auction Group · auctions, appraisals and liquidations since 1977
**Location:** Bayamón, Puerto Rico · San Francisco, CA
**Year:** 2026
**Role:** Design, development, CMS architecture, content migration, deployment

> **Portfolio copy.** Client-specific accounts (Sanity project ID, Formspree form ID, Netlify build hook) are not included. Copy `.env.example` to `.env` and add your own to run it. Without them the site builds with seed data.

---

#### Overview

A bilingual (EN/ES) marketing and auction-listing site for a family-run auction house with nearly 50 years of history. The brief: replace an aging Squarespace site with something fast and premium, and let a non-technical owner publish a new auction in a couple of minutes without ever touching code.

The site is static HTML on a CDN. Auctions are managed in a Sanity Studio built into the site at `/admin`, with the form written entirely in plain Spanish. Bidding itself stays on BidSpotter, so the site never handles registrations or payments.

---

#### Stack

| Layer | Choice | Rationale |
|---|---|---|
| Framework | Astro 5 (static output) | Zero JS by default, near-perfect Lighthouse, site stays up even if the CMS is down |
| Styling | Tailwind CSS v4 + custom CSS layer | Design tokens in `@theme`, brand palette and fonts self-hosted |
| Motion | GSAP + ScrollTrigger, Lenis | Scroll reveals, magnetic buttons, countdown; respects `prefers-reduced-motion` |
| CMS | Sanity Studio embedded at `/admin` | Client edits content in her own accounts, no developer needed |
| Forms | Formspree (AJAX, honeypot) | No backend; consignment and contact submissions go to the client's inbox |
| Hosting | Netlify (Git deploys) | Client-owned account; Sanity webhook triggers a rebuild on every publish |
| Maps/Bidding | Google Maps embed, BidSpotter | Directions per auction; one landing page used by every bid button |

---

#### Architecture

```
├── src/
│   ├── pages/            # Home, About, Services, Auctions, Auction detail, Consign, Past, Contact, Terms
│   ├── components/       # Header, Footer, AuctionCard, HowToBid, Marquee, forms
│   ├── lib/auctions.ts   # GROQ query, status logic, date/timezone helpers
│   ├── lib/site.ts       # Single source of truth for contact data and nav
│   └── data/             # Seed data used when no CMS is connected
├── sanity/auction.ts     # The auction schema (the "form" the client fills in)
└── public/               # Logos, favicon, headers, redirects
```

---

#### Technical highlights

**1. A CMS form designed for a non-technical editor.** The auction document is split into five tabs (basics, photos, text, catalog, extras). Only name, date and venue are required. Photos are dragged in all at once and the first is the cover. A "hide from site" switch replaces deleting, so nothing is ever lost by accident.

**2. Bilingual content without a translation framework.** Each auction stores Spanish and English text side by side. The detail page stacks both and gracefully falls back to whichever exists.

**3. Status is derived, not entered.** Upcoming, live and past are computed from dates in the `America/Puerto_Rico` timezone, with a missing end date defaulting to start + 24h. A daily scheduled rebuild moves finished auctions to Past on their own.

**4. Publish-to-live in under a minute.** A GROQ-powered Sanity webhook fires on create, update and delete of an auction and triggers a Netlify build. Verified end to end at about 45 seconds.

**5. Resilient by design.** If the CMS fetch fails at build time, the site falls back to seed data instead of failing. The output is plain static files.

**6. Accessibility and performance.** Semantic landmarks, visible focus states, reduced-motion support, self-hosted variable fonts, and image delivery through Sanity's CDN with width and format parameters.

---

#### Run it

```bash
npm install
cp .env.example .env     # optional; builds with seed data without it
npm run dev              # http://localhost:4321
npm run build            # static output in dist/
```
