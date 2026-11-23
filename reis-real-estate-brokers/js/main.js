// ============================================
// REIS — Site JavaScript
// ============================================

(function() {
  'use strict';

  // ============================================
  // LANGUAGE TOGGLE
  // ============================================
  const LANG_KEY = 'reis-lang';
  const validLangs = ['es', 'en'];

  function getStoredLang() {
    try {
      const stored = localStorage.getItem(LANG_KEY);
      if (validLangs.includes(stored)) return stored;
    } catch (e) {}
    // Default: Spanish (PR primary market)
    return 'es';
  }

  function setLang(lang) {
    if (!validLangs.includes(lang)) return;
    try { localStorage.setItem(LANG_KEY, lang); } catch (e) {}

    document.body.classList.toggle('is-es', lang === 'es');
    document.documentElement.setAttribute('lang', lang);

    // Update toggle UI
    document.querySelectorAll('.lang-toggle button').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === lang);
    });

    // Translate <option> text (can't contain HTML inside)
    document.querySelectorAll('select[data-translate-options] option').forEach(opt => {
      const text = opt.dataset[lang];
      if (text) opt.textContent = text;
    });

    // Translate input placeholders
    document.querySelectorAll('input[data-en-placeholder], textarea[data-en-placeholder]').forEach(el => {
      const ph = lang === 'es' ? el.dataset.esPlaceholder : el.dataset.enPlaceholder;
      if (ph) el.setAttribute('placeholder', ph);
    });
  }

  // Apply stored language ASAP (before DOM fully loads to prevent flash)
  document.addEventListener('DOMContentLoaded', () => {
    setLang(getStoredLang());

    // Bind toggle clicks
    document.querySelectorAll('.lang-toggle button').forEach(btn => {
      btn.addEventListener('click', () => setLang(btn.dataset.lang));
    });
  });

  // ============================================
  // CUSTOM CURSOR
  // ============================================
  const cursor = document.querySelector('.cursor');
  const cursorDot = document.querySelector('.cursor-dot');

  if (cursor && cursorDot && window.innerWidth > 768) {
    let mx = 0, my = 0, cx = 0, cy = 0;

    document.addEventListener('mousemove', e => {
      mx = e.clientX;
      my = e.clientY;
      cursorDot.style.left = mx + 'px';
      cursorDot.style.top = my + 'px';
    });

    function animateCursor() {
      cx += (mx - cx) * 0.18;
      cy += (my - cy) * 0.18;
      cursor.style.left = cx + 'px';
      cursor.style.top = cy + 'px';
      requestAnimationFrame(animateCursor);
    }
    animateCursor();

    // Hover state observer for dynamically added elements
    const updateCursorTargets = () => {
      document.querySelectorAll('a, button, .property-card, .area, .exp-card, .service-card, .stat-card, [data-cursor-hover]').forEach(el => {
        if (!el._cursorBound) {
          el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
          el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
          el._cursorBound = true;
        }
      });
    };
    updateCursorTargets();
    window._reisUpdateCursor = updateCursorTargets;
  }

  // ============================================
  // NAV SCROLL STATE
  // ============================================
  const nav = document.querySelector('nav.site-nav');
  if (nav) {
    const onScroll = () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  // ============================================
  // MOBILE NAV
  // ============================================
  const menuToggle = document.querySelector('.menu-toggle');
  const mobileNav = document.querySelector('.mobile-nav');
  if (menuToggle && mobileNav) {
    menuToggle.addEventListener('click', () => {
      const isOpen = mobileNav.classList.toggle('open');
      menuToggle.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        mobileNav.classList.remove('open');
        menuToggle.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ============================================
  // REVEAL ON SCROLL
  // ============================================
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          // Trigger counter if present
          const counter = entry.target.querySelector('.counter, [data-counter]');
          if (counter && !counter._counted) {
            counter._counted = true;
            animateCounter(counter);
          }
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
  } else {
    // Fallback: show everything
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  }

  // ============================================
  // COUNTER ANIMATION
  // ============================================
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target || el.dataset.counter || '0');
    const decimals = parseInt(el.dataset.decimals || '0');
    const duration = 1800;
    const start = performance.now();
    function tick(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const value = target * eased;
      el.textContent = decimals > 0 ? value.toFixed(decimals) : Math.round(value);
      if (progress < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  }

  // ============================================
  // MAGNETIC BUTTONS
  // ============================================
  document.querySelectorAll('.btn, [data-magnetic]').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      btn.style.transform = `translate(${x * 0.18}px, ${y * 0.18}px)`;
    });
    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });

  // ============================================
  // PARALLAX HERO (subtle)
  // ============================================
  const heroBg = document.querySelector('[data-hero-parallax]');
  if (heroBg) {
    window.addEventListener('scroll', () => {
      const y = window.scrollY;
      if (y < window.innerHeight) {
        heroBg.style.transform = `scale(1.06) translateY(${y * 0.25}px)`;
      }
    }, { passive: true });
  }

  // ============================================
  // EXPOSE HELPERS
  // ============================================
  window.REIS = {
    setLang,
    getLang: getStoredLang,
    animateCounter,
  };
})();
