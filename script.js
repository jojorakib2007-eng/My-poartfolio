// =========================================================
// AgJohn Portfolio — interactions
// =========================================================

document.getElementById('year').textContent = new Date().getFullYear();

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/* ---------------------------------------------------------
   Mobile nav toggle
--------------------------------------------------------- */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

navToggle.addEventListener('click', () => {
  const isOpen = navLinks.classList.toggle('is-open');
  navToggle.setAttribute('aria-expanded', String(isOpen));
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('is-open');
    navToggle.setAttribute('aria-expanded', 'false');
  });
});

/* ---------------------------------------------------------
   Scroll reveal
--------------------------------------------------------- */
const revealEls = document.querySelectorAll('.reveal');

if (prefersReducedMotion) {
  revealEls.forEach(el => el.classList.add('is-visible'));
} else {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  revealEls.forEach(el => revealObserver.observe(el));
}

/* ---------------------------------------------------------
   Ticker count-up (signature hero element)
--------------------------------------------------------- */
function animateValue(el) {
  const target = parseFloat(el.dataset.target);
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const prefix = el.dataset.prefix || '';
  const suffix = el.dataset.suffix || '';
  const duration = 1400;
  const start = performance.now();

  function tick(now) {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
    const current = target * eased;
    el.textContent = `${prefix}${current.toFixed(decimals)}${suffix}`;
    if (progress < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = `${prefix}${target.toFixed(decimals)}${suffix}`;
    }
  }
  requestAnimationFrame(tick);
}

const ticker = document.getElementById('ticker');
const tickerValues = ticker.querySelectorAll('.ticker__value');

if (prefersReducedMotion) {
  tickerValues.forEach(el => {
    const target = parseFloat(el.dataset.target);
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    el.textContent = `${el.dataset.prefix || ''}${target.toFixed(decimals)}${el.dataset.suffix || ''}`;
  });
} else {
  const tickerObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        tickerValues.forEach(animateValue);
        tickerObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });

  tickerObserver.observe(ticker);
}

/* ---------------------------------------------------------
   Lead form — client-side validation + fake submit
   (No backend is wired up. To connect this for real, replace
   the setTimeout block below with a fetch() call to your
   form endpoint, CRM webhook, or email service.)
--------------------------------------------------------- */
const form = document.getElementById('leadForm');
const status = document.getElementById('formStatus');

function setError(fieldName, message) {
  const errorEl = form.querySelector(`.form__error[data-for="${fieldName}"]`);
  if (errorEl) errorEl.textContent = message;
}

function clearErrors() {
  form.querySelectorAll('.form__error').forEach(el => { el.textContent = ''; });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();
  clearErrors();
  status.textContent = '';

  const name = form.name.value.trim();
  const email = form.email.value.trim();
  let hasError = false;

  if (!name) {
    setError('name', 'Enter your name.');
    hasError = true;
  }
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    setError('email', 'Enter a valid email address.');
    hasError = true;
  }

  if (hasError) return;

  const submitBtn = form.querySelector('.form__submit');
  const originalLabel = submitBtn.querySelector('.btn__label').textContent;
  submitBtn.disabled = true;
  submitBtn.querySelector('.btn__label').textContent = 'Sending…';

  // Placeholder for a real submission — swap this timeout for a fetch() call.
  setTimeout(() => {
    submitBtn.disabled = false;
    submitBtn.querySelector('.btn__label').textContent = originalLabel;
    status.textContent = `Thanks, ${name.split(' ')[0]} — I'll reply within one business day.`;
    form.reset();
  }, 700);
});

/* ---------------------------------------------------------
   Nav background on scroll (subtle)
--------------------------------------------------------- */
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.style.borderBottomColor = window.scrollY > 20
    ? 'rgba(237,234,226,0.14)'
    : 'rgba(237,234,226,0.09)';
}, { passive: true });
