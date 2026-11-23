# REIS Real Estate Brokers

**Live:** [reisreb.org](https://reisreb.org)
**Client:** José R. Andrades · REIS Real Estate Brokers · Lic. C-15411
**Location:** Puerto Rico (island-wide, incl. Vieques & Culebra)
**Year:** 2026
**Role:** Design, development, content strategy, image processing, deployment


> **Portfolio copy.** The live Web3Forms access key is replaced with `YOUR_WEB3FORMS_ACCESS_KEY`. Add your own key to the form in `contacto.html` to run it.

---

#### Overview

A bilingual marketing and lead-generation site for a licensed Puerto Rico real estate broker who also operates as a certified property inspector. The client's differentiator is the integration of three normally separate disciplines — inspection, valuation, and brokerage — into a single practice, and the site architecture was built to communicate that technical rigor rather than function as a generic property catalog.

Delivered as a static site the client fully owns: his domain, his hosting account, his code, no platform lock-in and no recurring software fees.

---

#### Stack

| Layer | Choice | Rationale |
|---|---|---|
| Markup | Semantic HTML5 | No framework overhead for a 4-page site; maximum portability |
| Styling | CSS3 + custom properties | Token-driven theming, zero preprocessor dependency |
| Scripting | Vanilla JavaScript (ES6+) | ~8 KB total; no runtime, no bundler |
| Forms | Web3Forms API | Serverless submission handling, no backend required |
| Fonts | Fraunces / Geist / Geist Mono | Display serif + geometric sans + mono for technical labels |
| Image pipeline | Python (Pillow, NumPy) | Background removal, B&W grading, compression |
| Hosting | Hostinger (static) | Client-owned account, no build pipeline needed |

---

#### Architecture

```
reisreb.org/
├── index.html           # Home — hero, credentials, method, listing, coverage
├── nosotros.html        # About — founder profile, origin story, differentiators
├── servicios.html       # Services — brokerage, inspection, mortgage calculator
├── contacto.html        # Contact — form, methods, quick actions
├── css/
│   ├── main.css         # Design tokens, nav, footer, cursor, i18n, shared
│   ├── home.css         # Hero, credential bar, method grid, listing, coverage
│   └── page.css         # Inner-page layouts, calculator, forms, quick actions
├── js/
│   └── main.js          # i18n, cursor, reveals, counters, magnetics, nav
└── assets/              # Logo, processed portraits, landscape imagery, listing photos
```

**Separation rationale:** `main.css` holds everything shared across all four pages (tokens, chrome, internationalization rules). `home.css` and `page.css` split page-specific layout so no single file exceeds comfortable editing size and the client can locate rules by page when making his own edits.

---

#### Technical highlights

**1. Design-token theming**

All color, border, and easing values resolve through CSS custom properties declared on `:root`. Component rules never hardcode hex values.

```css
:root {
  --bg: #ffffff;
  --bg-2: #fafafa;
  --ink: #0a0a0c;
  --ink-soft: #2a2a2e;
  --ink-dim: #4a4a52;
  --line: rgba(10,10,12,0.08);
  --accent: #1A3FF0;
  --ease: cubic-bezier(.16, 1, .3, 1);
}
```

The site shipped first in a dark theme. When the client requested light, the conversion was executed primarily by rewriting this block — component CSS required only targeted adjustments for shadow direction, backdrop opacity, and contrast ratios, rather than a full restyle.

---

**2. Bilingual system (ES/EN)**

Rather than duplicating pages or routing through a translation service, every translatable string exists inline as a paired element:

```html
<h3>
  <span data-en>Certified Inspector</span>
  <span data-es>Inspector Certificado</span>
</h3>
```

CSS handles visibility, with specificity raised above component rules to survive `display` declarations on parent classes:

```css
body [data-en] { display: inline; }
body [data-es] { display: none; }
body.is-es [data-es] { display: inline; }
body.is-es [data-en] { display: none; }
```

JavaScript applies the stored preference before paint, persists it, and patches the gaps CSS can't address — `<option>` elements can't contain child markup, and `placeholder` is an attribute rather than content:

```js
function setLang(lang) {
  localStorage.setItem('reis-lang', lang);
  document.body.classList.toggle('is-es', lang === 'es');
  document.documentElement.setAttribute('lang', lang);

  document.querySelectorAll('select[data-translate-options] option')
    .forEach(opt => { if (opt.dataset[lang]) opt.textContent = opt.dataset[lang]; });

  document.querySelectorAll('[data-en-placeholder]')
    .forEach(el => el.setAttribute('placeholder',
      lang === 'es' ? el.dataset.esPlaceholder : el.dataset.enPlaceholder));
}
```

Defaults to Spanish (primary market), persists across page navigation, falls back gracefully if `localStorage` is unavailable.

---

**3. Mortgage calculator**

Standard amortization, computed client-side with no network round-trip. Range inputs bind live to both the displayed parameter values and the output:

```js
const loanAmount  = price * (1 - downPct / 100);
const monthlyRate = annualRate / 100 / 12;
const months      = termYears * 12;

const monthlyPayment = monthlyRate > 0
  ? loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, months))
                / (Math.pow(1 + monthlyRate, months) - 1)
  : loanAmount / months;

const totalInterest = (monthlyPayment * months) - loanAmount;
```

Outputs monthly principal & interest, loan amount, and lifetime interest. Carries a bilingual disclaimer noting exclusion of CRIM (Puerto Rico property tax), insurance, and HOA — jurisdiction-specific costs a generic calculator would omit.

---

**4. Motion layer**

Written without GSAP, Framer Motion, or any animation library.

- **Custom cursor** — dual-element (ring + dot), position lerped at `0.18` per frame inside a `requestAnimationFrame` loop; hover state bound across interactive elements with a re-scan hook for dynamically added nodes
- **Magnetic buttons** — pointer offset from element center multiplied by `0.18`, applied as `translate`, reset on `mouseleave`
- **Scroll reveals** — `IntersectionObserver` at `0.12` threshold with `-60px` bottom root margin; staggered via delay utility classes; observer disconnects per element after firing
- **Counters** — ease-out-cubic interpolation (`1 - (1-t)³`) over 1800ms, triggered on first intersection
- **Marquee** — pure CSS keyframe translation on a duplicated track for seamless looping
- **Hero parallax** — scroll-coupled transform, bounded to viewport height to avoid off-screen computation

All of it gated:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

Custom cursor is disabled entirely below 768px, where it has no meaning.

---

**5. Form handling**

Serverless submission through Web3Forms with async `fetch`, a hidden honeypot field for bot filtering, and inline status messaging that reads the active language at submission time:

```js
const res  = await fetch(form.action, { method: 'POST', body: new FormData(form) });
const json = await res.json();
const isEs = document.body.classList.contains('is-es');

status.innerHTML = json.success
  ? (isEs ? '✓ Mensaje enviado...' : '✓ Message sent...')
  : (isEs ? '✕ Hubo un error. Llama: 787-550-3902'
          : '✕ Something went wrong. Call: 787-550-3902');
```

Failure state surfaces the direct phone number rather than dead-ending the lead.

---

**6. Image processing pipeline**

Client supplied a logo on a flat background and a casual phone portrait. Both were processed programmatically in Python rather than by hand, making the treatment reproducible.

*Logo background removal* — alpha thresholding on per-pixel brightness, with a transition band mapping mid-range values to partial alpha so letterform edges stay smooth instead of aliasing:

```python
brightness = (r.astype(int) + g.astype(int) + b.astype(int)) / 3
data[:, :, 3] = np.where(brightness > 220, 0, 255).astype(np.uint8)

transition = (brightness > 150) & (brightness <= 220)
alpha = np.clip(255 * (1 - (brightness - 150) / 70), 0, 255).astype(np.uint8)
data[:, :, 3] = np.where(transition, alpha, data[:, :, 3])
```

*Editorial portrait* — crop to 3:4, desaturate to 0.85, lift shadows below luminance 100, correct warm cabin-light white balance (`R × 0.97`, `B × 1.02`), unsharp mask at radius 1.5 / 60%, then grayscale with a toned black point. Result reads as intentional editorial photography rather than a repurposed snapshot.

---

#### Accessibility & performance

- Mobile-first; breakpoints at 768px, 900px, 1100px
- `prefers-reduced-motion` honored globally
- Semantic landmarks, `aria-label` on icon-only controls, visible focus states
- Functions without JavaScript: content renders, links work, form degrades to native POST
- Total page weight under 1.3 MB including all imagery
- Zero third-party runtime — no analytics bundle, no jQuery, no framework

---

#### Deliverables

- Four production pages, bilingual
- Processed logo (transparent PNG) and portrait variants
- Working contact form wired to client's inbox
- Mortgage calculator
- Active listing module with photo gallery and spec table
- Written self-management guide (adding/removing listings, editing copy)
- Deployment to client-owned domain and hosting

---

#### Notes

Built and deployed directly into the client's own Hostinger account and domain from day one — no migration step, no transfer risk. The client owns the code, the domain, and the hosting account outright.

---

*Built by [Lizardi Technologies](https://lizarditech.com) — Puerto Rico*
