# PURO Sin Fondo

Five-page, bilingual (ES/EN) marketing website for **PURO Sin Fondo**, a creole/Spanish fusion restaurant in Toa Baja, Puerto Rico.

- **Live site:** [purorest.com](https://purorest.com)
- **Role:** Sole designer and developer
- **Stack:** HTML5, CSS3, vanilla JavaScript (ES6), GSAP + ScrollTrigger
- **Hosting:** Hostinger (static file drop)

## Overview

A hand-coded static site with no framework and no build step. It pairs an editorial design with a scroll-driven motion layer and includes a serverless lead-capture popup, while staying a plain folder of HTML files the client can host anywhere.

## Pages

| Page | File | Purpose |
|---|---|---|
| Home | `index.html` | Hero, signature dishes, brand story, marquee |
| Menu | `menu.html` | 8 categories with sticky category bar and lead-capture popup |
| About | `nosotros.html` | Story and chef bio |
| Visit | `visitanos.html` | Location, hours, dark-themed map, Instagram grid |
| Reserve | `reservar.html` | Phone and WhatsApp reservations |

## Technical highlights

- **Bilingual system (ES/EN):** dependency-free i18n per page. `data-i18n` keys plus an `es`/`en` dictionary, with the choice saved in `localStorage` and restored on every page. Dictionary values can hold inline HTML, so animated, split-line headings translate without losing styling.
- **Motion layer:** GSAP 3.12.5 and ScrollTrigger for split-text reveals, scroll-driven entrances, parallax, clip-path dish reveals, animated counters, a custom cursor and a scroll progress bar. Everything is guarded for `prefers-reduced-motion`, with a no-JS fallback that keeps content visible.
- **Lead capture:** a name and phone popup that POSTs to the Web3Forms API with no backend or database. It has per-page timing, a source field for attribution, and `localStorage` flags so it does not reappear after a visitor submits. The access key in this repo is a placeholder.
- **Design system:** near-black background with two accents (brand red `#C0272D`, gold `#D4A847`) on a cream text tone. Playfair Display for display, Barlow for body, all defined as CSS custom properties.
- **Cross-device hardening:** a shared CSS safety layer (`text-size-adjust`, horizontal-overflow guards, long-word wrapping) for Android and Firefox issues. Layouts are mobile-first, checked at 380px, 768px and 1280px.
- **Reservations:** `tel:` links and WhatsApp `wa.me` deep links with pre-filled messages, matching how the restaurant takes bookings.
- **Maps and feeds:** a key-free Google Maps embed and a hand-built Instagram grid with no third-party widget.
- **Asset pipeline:** 22 food and cocktail photos optimized in batch with Python and Pillow, a transparent logo, and generated multi-size favicons.

## Structure

```
puro-sin-fondo/
├── index.html
├── menu.html
├── nosotros.html
├── visitanos.html
├── reservar.html
└── images/
    ├── logo.png, logo-nav.png
    ├── favicon*.png, favicon.ico
    └── gallery/   (22 optimized photos)
```

## Run locally

```bash
python3 -m http.server 8000
```

Open `http://localhost:8000`.

---

Designed and developed by [Lizardi Technologies](https://lizarditech.com).
