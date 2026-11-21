# El Rey Cantina Mexicana

Multi-page static website for **El Rey Cantina Mexicana**, a Mexican-criollo restaurant in San Juan, Puerto Rico.

- **Live site:** [elreycantinamexicana.com](https://elreycantinamexicana.com)
- **Role:** Original designer and developer
- **Year:** 2026
- **Stack:** HTML, CSS, vanilla JavaScript (no frameworks, no build step)
- **Hosting:** Hostinger shared hosting

> **Note:** The client is currently working with another web design agency, so the live site may differ from this version. This repository is the original build I created for them.

## Overview

A fast, brand-driven site for a restaurant with a non-technical owner. Plain HTML/CSS/JS means zero runtime cost, no dependencies to maintain, and files the client can host anywhere.

## Pages in this repo

| Page | File | Purpose |
|---|---|---|
| Home | `index.html` | Hero, brand intro, highlights, calls to action |
| Experience | `experiencia.html` | Karaoke, sports, private rooms, kid-friendly, catering |
| Visit | `visita.html` | Address, weekly hours, embedded map, services |
| Reserve | `reservar.html` | Reservation channels, private rooms, catering |

The original build also included a full menu page (`menu.html`), which is not part of this repository copy.

## Technical highlights

- **Custom design system** with CSS custom properties (`:root`) for the client palette (magenta `#E6007E`, cyan `#00E5FF`, orange `#FF9900`, gold `#FFD700`) on a charcoal background, so color tokens stay consistent across components.
- **Typography:** Bebas Neue (display), Permanent Marker (hand-drawn accents) and DM Sans (body) from Google Fonts, with `preconnect` hints to reduce render-blocking time.
- **Mobile-first responsive layout** using CSS Grid, Flexbox and `aspect-ratio` for consistent media cards.
- **Animated hero:** a floating logo watermark behind the headline using a looping CSS keyframe animation, disabled under `prefers-reduced-motion`.
- **Resilient images:** `onerror` fallbacks swap in a styled placeholder if an image file is missing, so the client can add photos by uploading correctly named files with no HTML changes.
- **Reservations via WhatsApp:** `wa.me` deep links with pre-filled, URL-encoded Spanish messages for one-tap mobile booking.
- **Shared navigation and footer** across pages, with the active page highlighted automatically by a small vanilla JS file.
- **No third-party scripts, cookies or tracking.**

## Structure

```
el-rey-cantina-mexicana/
├── index.html
├── experiencia.html
├── visita.html
├── reservar.html
├── assets/
│   ├── styles.css
│   └── main.js
└── images/
    └── logo.png
```

Client photography is not included in this repository.

## Run locally

No build step. Open `index.html` in a browser, or serve the folder:

```bash
python3 -m http.server 8000
```

---

Designed and developed by [Lizardi Technologies](https://lizarditech.com).
