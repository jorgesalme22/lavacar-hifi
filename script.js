/* ═══════════════════════════════════════
   LAVACAR HI-FI — script.js v5.0
   ═══════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

  /* ── Header scroll ── */
  const header = document.getElementById('header');
  if (header) {
    const onScroll = () => header.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  /* ── Menú móvil ── */
  const hamburger = document.querySelector('.hamburger');
  const mobileNav = document.querySelector('.mobile-nav');
  if (hamburger && mobileNav) {
    hamburger.addEventListener('click', () => {
      const open = hamburger.classList.toggle('open');
      mobileNav.classList.toggle('open', open);
      mobileNav.setAttribute('aria-hidden', String(!open));
      document.body.style.overflow = open ? 'hidden' : '';
    });
    mobileNav.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        hamburger.classList.remove('open');
        mobileNav.classList.remove('open');
        mobileNav.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
      });
    });
  }

  /* ── Reveal on scroll (IntersectionObserver) ── */
  const revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (revealEls.length && 'IntersectionObserver' in window) {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          obs.unobserve(e.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -32px 0px' });
    revealEls.forEach(el => obs.observe(el));
  } else {
    // Sin IntersectionObserver o prefers-reduced-motion: mostrar todo
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ── Respeto a prefers-reduced-motion ── */
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReduced) {
    revealEls.forEach(el => el.classList.add('visible'));
  }

  /* ── Contadores animados ── */
  const counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window && !prefersReduced) {
    const cObs = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (!e.isIntersecting) return;
        const el     = e.target;
        const target = parseFloat(el.dataset.count);
        const isDec  = el.dataset.dec === '1';
        const suffix = el.dataset.suffix || '';
        const dur    = 1400;
        const start  = performance.now();
        // ease-out-cubic
        const tick = now => {
          const p = Math.min((now - start) / dur, 1);
          const eased = 1 - Math.pow(1 - p, 3);
          const v = target * eased;
          el.textContent = (isDec ? v.toFixed(1) : Math.floor(v)) + suffix;
          if (p < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
        cObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    counters.forEach(c => cObs.observe(c));
  }

  /* ── Nav activo por página ── */
  const page = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a, .mobile-nav a').forEach(a => {
    const href = a.getAttribute('href');
    if (href && href === page) a.classList.add('active');
  });

});
