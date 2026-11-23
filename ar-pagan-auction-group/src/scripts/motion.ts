import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const $$ = <T extends HTMLElement = HTMLElement>(s: string) => Array.from(document.querySelectorAll<T>(s));

/* ---------- header ---------- */
const header = document.querySelector<HTMLElement>('[data-header]');
const onScroll = () => header?.classList.toggle('is-scrolled', scrollY > 40);
addEventListener('scroll', onScroll, { passive: true });
onScroll();

/* ---------- mobile menu ---------- */
const btn = document.getElementById('menu-toggle');
const menu = document.getElementById('mobile-menu');
const setMenu = (open: boolean) => {
  menu?.classList.toggle('hidden', !open);
  btn?.setAttribute('aria-expanded', String(open));
  document.documentElement.style.overflow = open ? 'hidden' : '';
};
btn?.addEventListener('click', () => setMenu(btn.getAttribute('aria-expanded') !== 'true'));
addEventListener('keydown', (e) => { if (e.key === 'Escape') setMenu(false); });
menu?.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => setMenu(false)));

/* ---------- counters ---------- */
const fmt = (n: number) => Math.round(n).toLocaleString('en-US');
$$('[data-count]').forEach((el) => {
  const to = Number(el.dataset.count);
  const suffix = el.dataset.suffix ?? '';
  const set = (v: number) => (el.textContent = fmt(v) + suffix);
  if (reduce) return set(to);
  set(0);
  const o = { v: 0 };
  ScrollTrigger.create({
    trigger: el, start: 'top 90%', once: true,
    onEnter: () => gsap.to(o, { v: to, duration: 2.2, ease: 'power3.out', onUpdate: () => set(o.v) }),
  });
});

/* ---------- countdown ---------- */
$$('[data-countdown]').forEach((el) => {
  const target = new Date(el.dataset.countdown!).getTime();
  const parts = { d: el.querySelector('[data-d]'), h: el.querySelector('[data-h]'), m: el.querySelector('[data-m]'), s: el.querySelector('[data-s]') };
  const pad = (n: number) => String(n).padStart(2, '0');
  const tick = () => {
    const diff = Math.max(0, target - Date.now());
    if (diff === 0) { el.innerHTML = `<span class="font-display text-3xl text-brass">${el.dataset.done ?? 'Bidding is open'}</span>`; return false; }
    const s = Math.floor(diff / 1000);
    parts.d && (parts.d.textContent = pad(Math.floor(s / 86400)));
    parts.h && (parts.h.textContent = pad(Math.floor((s % 86400) / 3600)));
    parts.m && (parts.m.textContent = pad(Math.floor((s % 3600) / 60)));
    parts.s && (parts.s.textContent = pad(s % 60));
    return true;
  };
  if (tick()) { const id = setInterval(() => { if (!tick()) clearInterval(id); }, 1000); }
});

/* ---------- forms (Formspree, no page reload) ---------- */
$$<HTMLFormElement>('form[data-ajax]').forEach((form) => {
  const status = form.querySelector<HTMLElement>('[data-status]');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!form.action || form.action.endsWith('#') || form.action.endsWith('/f/')) {
      if (status) status.textContent = 'Form not connected yet.';
      return;
    }
    const submit = form.querySelector<HTMLButtonElement>('button[type=submit]');
    submit && (submit.disabled = true);
    try {
      const r = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      if (!r.ok) throw new Error();
      form.reset();
      if (status) { status.textContent = form.dataset.ok ?? 'Thank you — we got it.'; status.className += ' text-brand-bright'; }
    } catch {
      if (status) { status.textContent = 'Something went wrong. Please email info@arpagan.com.'; status.className += ' text-red-300'; }
    } finally { submit && (submit.disabled = false); }
  });
});

/* ---------- lightbox ---------- */
const items = $$<HTMLButtonElement>('[data-lightbox] button[data-full]');
if (items.length) {
  let i = 0;
  const box = document.createElement('div');
  box.className = 'fixed inset-0 z-[100] hidden items-center justify-center bg-night/95 backdrop-blur-sm';
  box.setAttribute('role', 'dialog'); box.setAttribute('aria-modal', 'true'); box.setAttribute('aria-label', 'Photo viewer');
  box.innerHTML = `
    <button data-x class="absolute top-4 right-4 w-12 h-12 rounded-full glass text-2xl" aria-label="Close">×</button>
    <button data-p class="absolute left-3 md:left-8 w-12 h-12 rounded-full glass text-2xl" aria-label="Previous photo">‹</button>
    <button data-n class="absolute right-3 md:right-8 w-12 h-12 rounded-full glass text-2xl" aria-label="Next photo">›</button>
    <img class="max-h-[88vh] max-w-[92vw] object-contain rounded" alt="" />
    <p class="absolute bottom-4 font-mono text-xs text-white/60" data-c></p>`;
  document.body.appendChild(box);
  const im = box.querySelector('img')!;
  const count = box.querySelector('[data-c]')!;
  const show = (n: number) => {
    i = (n + items.length) % items.length;
    im.src = items[i].dataset.full!;
    count.textContent = `${i + 1} / ${items.length}`;
  };
  const open = (n: number) => { show(n); box.classList.remove('hidden'); box.classList.add('flex'); document.documentElement.style.overflow = 'hidden'; (box.querySelector('[data-x]') as HTMLElement).focus(); };
  const close = () => { box.classList.add('hidden'); box.classList.remove('flex'); document.documentElement.style.overflow = ''; items[i].focus(); };
  items.forEach((b, n) => b.addEventListener('click', () => open(n)));
  box.querySelector('[data-x]')!.addEventListener('click', close);
  box.querySelector('[data-p]')!.addEventListener('click', () => show(i - 1));
  box.querySelector('[data-n]')!.addEventListener('click', () => show(i + 1));
  box.addEventListener('click', (e) => { if (e.target === box) close(); });
  addEventListener('keydown', (e) => {
    if (box.classList.contains('hidden')) return;
    if (e.key === 'Escape') close();
    if (e.key === 'ArrowLeft') show(i - 1);
    if (e.key === 'ArrowRight') show(i + 1);
  });
}

/* ---------- motion (skipped entirely for reduced-motion users) ---------- */
if (!reduce) {
  const lenis = new Lenis({ duration: 1.15, smoothWheel: true });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);

  $$('.reveal').forEach((el) => {
    gsap.to(el, {
      opacity: 1, y: 0, duration: 1.1, ease: 'power3.out', delay: Number(el.dataset.delay ?? 0),
      scrollTrigger: { trigger: el, start: 'top 90%', once: true },
    });
  });

  $$('[data-parallax]').forEach((el) => {
    const speed = Number(el.dataset.parallax);
    gsap.to(el, { yPercent: speed * 100, ease: 'none', scrollTrigger: { trigger: el.parentElement!, start: 'top bottom', end: 'bottom top', scrub: true } });
  });

  $$('[data-progress]').forEach((el) => {
    gsap.fromTo(el, { scaleY: 0 }, { scaleY: 1, ease: 'none', transformOrigin: 'top', scrollTrigger: { trigger: el.parentElement!, start: 'top 70%', end: 'bottom 60%', scrub: true } });
  });

  if (matchMedia('(hover: hover)').matches) {
    $$('[data-magnetic]').forEach((el) => {
      const x = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3.out' });
      const y = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3.out' });
      el.addEventListener('pointermove', (e) => {
        const r = el.getBoundingClientRect();
        x((e.clientX - (r.left + r.width / 2)) * 0.28);
        y((e.clientY - (r.top + r.height / 2)) * 0.28);
      });
      el.addEventListener('pointerleave', () => { x(0); y(0); });
    });
  }
}
