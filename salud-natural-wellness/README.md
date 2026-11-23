# Salud Natural Wellness & Learning Center

Five-page bilingual (EN/ES) website for a naturopathic wellness practice and training center in Caguas, Puerto Rico. It replaces the client's previous Wix site and puts the practice's therapeutic services and its certification courses under one brand.

- **Year:** 2026
- **Role:** Designer and developer (Lizardi Technologies)
- **Stack:** HTML5, CSS3, vanilla JavaScript (ES6+), inline SVG
- **Hosting target:** Hostinger shared hosting (works on any static host)

> **Portfolio copy.** The inquiry form in `contact.html` has an empty `action` (endpoint set at launch), and the credit-card payment link is a placeholder.

## Overview

An "apothecary luxury" design: alternating dark and ivory sections, an editorial serif paired with a clean sans, and a gold accent. The site covers about 20 services and 6 certification courses, each with its own animated SVG emblem. The client books by appointment only, so there is no calendar system. Booking goes through WhatsApp and email, and enrollment through an inquiry form.

## Pages

| Page | File | Purpose |
|---|---|---|
| Home | `index.html` | Loader, hero, featured course, credentials, discount band |
| About | `about.html` | Origin story, space gallery, credentials, testimonials |
| Courses | `courses.html` | 6 certification programs, comparison table, immersion stay |
| Services | `services.html` | Packages, core modalities, add-on therapies, FAQ, downloadable forms |
| Enroll | `contact.html` | Enrollment steps, inquiry form, payment options, map, FAQ |

## Technical highlights

- **Bilingual system (EN/ES):** `data-en` / `data-es` attributes for short strings, paired `data-lang` elements for headlines that contain styled emphasis, and a language toggle whose choice persists in `localStorage`. Hero entrance animations replay on language switch.
- **Design system:** CSS custom properties for the onyx, ivory, emerald and gold palette, Cormorant Garamond display type and Inter body, and a rule that renders every `<em>` as gold serif italic.
- **Motion with fallbacks:** `IntersectionObserver` scroll reveals with staggered delays, magnetic buttons on desktop, a `clip-path` mobile menu, and an animated loader. `prefers-reduced-motion` turns motion off.
- **Interaction:** sticky jump navigation with a live active state, accordion FAQ and FYI sections, and a compare table for the six courses.
- **Cross-device hardening:** `text-size-adjust`, `overflow-x` handling on `html` and `body`, `min-width: 0` on flex children and wrapping for long words. Checked at 393px, 768px, 1280px and 1440px.
- **Downloadable intake forms:** 8 branded PDFs (4 forms in English and Spanish) generated with Python and reportlab.
- **Zero dependencies:** no frameworks, no build step, no third-party scripts. CSS and JavaScript are inline per page, so each page is one request.

## Structure

```
salud-natural-wellness/
├── index.html
├── about.html
├── courses.html
├── services.html
├── contact.html
├── images/    (6 photos)
└── forms/     (8 PDFs)
```

## Run locally

```bash
python3 -m http.server 8000
```

---

Designed and developed by [Lizardi Technologies](https://lizarditech.com).
