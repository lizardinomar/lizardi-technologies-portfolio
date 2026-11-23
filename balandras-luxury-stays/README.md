# Balandras Luxury Stays

Six-page bilingual (ES/EN) website for a private four-unit beachfront rental complex in Cerro Gordo, Puerto Rico, with a per-unit add-on services cart that pays through Stripe.

- **Role:** Designer and developer (Lizardi Technologies)
- **Year:** 2026
- **Stack:** HTML5, CSS3, vanilla JavaScript. No framework, no build step.
- **Integrations:** Guesty booking widget, Stripe Payment Link, Web3Forms, WhatsApp

> **Portfolio copy.** The Stripe Payment Link and Web3Forms access key are replaced with `YOUR_PAYMENT_LINK` and `YOUR_WEB3FORMS_ACCESS_KEY`. The unit guide PDFs are not included, and photos are downscaled to keep the repository small.

## Key decision: no custom booking engine

The brief asked for a reservation system with live availability. The client already runs Guesty, which handles availability, channel sync across Airbnb, Expedia and Vrbo, and reservation payments. A standalone calendar would risk double bookings as soon as a guest booked on an OTA. So Guesty stays the system of record, and the site wraps it:

- The Guesty search widget sits in a booking band on the home page, recolored to the brand terracotta.
- Each unit links straight to its Guesty property page.
- A 3.5-second fallback shows a "check availability" button if the widget script fails, so booking never dead-ends.

What Guesty can't do is quantity-based add-ons (chef per guest, nanny per hour, paella by the pair, laundry per load), so that part is custom.

## Add-on services cart

- **Unit gate:** the service list stays locked until the guest picks a unit, then a rules modal opens with that unit's house rules and an accept checkbox.
- **Per-unit pricing:** 18 services across 5 groups, each priced per unit. A price can be a number, `null` (not offered) or `'q'` (quote only). A `per` field drives the quantity stepper (guest, hour, pair, load).
- **Live re-pricing:** switching units re-prices the cart, drops services the new unit doesn't offer and reports what was removed, so the drawer total always matches what Stripe charges.
- **Checkout:** the cart total is computed in JavaScript and sent to a single Stripe "customer chooses what to pay" link with a prefilled amount. The itemized order goes to the client by email through Web3Forms. That request doesn't block the redirect, so a form outage can't stop a guest from paying. Quote-only items route to WhatsApp.
- **Trade-offs documented:** I rejected ~23 separate Payment Links as unmanageable, and a Cloudflare Worker with Checkout Sessions because it adds a backend the client would depend on me to maintain. The prefilled-amount parameter is undocumented by Stripe, so the planned fallback is Checkout Sessions behind a Worker. A minimum and maximum amount are set in the Stripe dashboard.

## Other technical highlights

- **Bilingual system:** paired `data-es` / `data-en` spans toggled by a class on `<body>`, saved to `localStorage` inside try/catch so private browsing can't break it, with `<html lang>` updated on every switch. Formal Spanish (usted) throughout.
- **Design system:** cream, terracotta and olive palette taken from the client's logo, Cormorant Garamond and Jost, and one `--shell` token that controls every section's horizontal padding.
- **Signature interactions:** a unit navigator that crossfades a full-bleed background on hover, an editorial explore index, scroll reveals, hover zoom and a hero Ken Burns effect, all disabled under `prefers-reduced-motion`.
- **SEO:** unique titles and descriptions per page, Open Graph tags and `LodgingBusiness` JSON-LD.
- **Security:** the client's unit brochures contained WiFi passwords and a gate code. I removed those pages and redacted the code at the PDF level so the text can't be copied out, then verified the text layer and the raw streams.

## Debugging notes

- **Zero-height grid collapse:** a desktop-only rule made grid row height depend on image height and image height depend on row height, so rows collapsed to 0px. Fixed with a definite `clamp()` row height.
- **Scroll-reveal deadlock:** a clipped container with lazy images could never reach its visibility threshold, so the images never loaded. Fixed by switching to opacity and scale, a root margin, and two timed fail-open fallbacks, so the worst case is a missed animation and never invisible content.
- **Specificity bug:** `.ug a` out-scored `.ug-more`, so a mobile-only tile showed on desktop. Fixed by scoping the selector.
- **Cart re-pricing:** unit switches left stale prices in the cart. Fixed with a full row reset on every render.

## Structure

```
balandras-luxury-stays/
├── index.html
├── unidades.html
├── servicios.html
├── reglas.html
├── nosotros.html
├── contacto.html
└── assets/images/   (units, utilities, views, general, logos, favicons)
```

## Run locally

```bash
python3 -m http.server 8000
```

---

Designed and developed by [Lizardi Technologies](https://lizarditech.com).
