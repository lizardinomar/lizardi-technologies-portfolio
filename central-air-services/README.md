# Central Air Services

Four-page Spanish website for **Central Air Services LLC**, a Puerto Rico HVAC contractor, with an integrated service cart and Stripe-hosted checkout. No backend.

- **Live site:** [centralairservicespr.com](https://www.centralairservicespr.com)
- **Year:** 2026
- **Role:** Designer and developer (Lizardi Technologies)
- **Stack:** HTML5, CSS3, vanilla JavaScript, GSAP + ScrollTrigger (CDN)
- **Hosting:** Hostinger, on the client's own account and domain

> **Portfolio copy.** The Stripe Payment Link in `servicios.html` is replaced with `YOUR_PAYMENT_LINK`. Add a link from your own Stripe account to run the checkout.

## Overview

A dark, industrial-technical site for an HVAC business, built to sell and book work online. Visitors browse a catalog of air conditioner units and services, build a cart, then either pay by card through Stripe or hand the order to the owner over WhatsApp. Everything is static HTML, CSS and JavaScript with no build step and no runtime cost.

## Pages

| Page | File | Purpose |
|---|---|---|
| Home | `index.html` | Hero, owner story, services preview, island coverage map, financing, certifications |
| About | `nosotros.html` | Owner story, mission and vision, stats, promises, certifications |
| Services | `servicios.html` | Service cards, AC unit catalog, cart, variant picker, checkout |
| Contact | `contacto.html` | Form that hands off to WhatsApp, contact details, FAQ |

## Technical highlights

- **Client-side cart and checkout:** cart state lives in JavaScript. Items flagged as quote-only are excluded from the payable total. A cart drawer, a floating action button with an add animation, and a full-screen variant-picker modal handle multi-option services.
- **Two-path checkout:** "pay now" sends the total to a single Stripe-hosted Payment Link with a prefilled amount, and a second button sends a formatted cart message to WhatsApp for installs, quotes and other payment methods.
- **Catalog with 16 payable price points** across 4 unit models, with per-variant add-to-cart buttons, brand-specific warranty details and a basic-install disclaimer to limit scope creep after online payment.
- **Interactive coverage map:** a hand-positioned node map of Puerto Rico with hover tooltips, plus a responsive chip list of all served municipalities.
- **Motion:** GSAP and ScrollTrigger scroll reveals with staggered delays, tilt-on-hover cards and a rotating shield emblem, with `prefers-reduced-motion` handled.
- **Design system:** dark background with orange and blue accents, using Oswald, Barlow Condensed and Barlow. Mobile-first, checked at 390px, 768px and 1440px.
- **Image processing (Python, PIL and NumPy):** product photos composited onto branded plinth tiles with glow and contact shadows so mixed source photos look like one product line. The logo set includes a transparent version, a 3D emblem tile and a favicon.
- **Zero backend:** the form hands off to WhatsApp and payments go through Stripe, so there is nothing to host or maintain beyond static files. Total weight is about 1.6 MB.

### Known trade-off

The payable amount is computed in the browser and passed to Stripe, so it isn't tamper-proof, and Stripe's receipt doesn't show line items. The planned upgrade is Stripe Checkout Sessions through a small serverless function, with line items locked server-side and the same cart UI.

## Structure

```
central-air-services/
├── index.html
├── nosotros.html
├── servicios.html
├── contacto.html
└── assets/
    ├── logo.png, logo-sm.png, logo-3d-emblem.jpg, favicon.png
    └── unit-xtreme.jpg, unit-pro.jpg, unit-elegance.jpg, unit-fujitsu.jpg
```

## Run locally

```bash
python3 -m http.server 8000
```

---

Designed and developed by [Lizardi Technologies](https://lizarditech.com).
