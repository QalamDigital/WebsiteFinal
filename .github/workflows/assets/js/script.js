// ─── THEME TOGGLE (Light is default, dark is opt-in) ───
(function() {
  // Always remove any old stored theme — light is the permanent default
  localStorage.removeItem('theme');
  // Body stays without 'dark' class = light mode always on fresh load
})();
 
document.addEventListener('DOMContentLoaded', () => {
  const toggleBtns = [
    document.getElementById('theme-toggle-mobile'),
    document.getElementById('theme-toggle-desktop')
  ];
  toggleBtns.forEach(btn => {
    if (!btn) return;
    btn.addEventListener('click', () => {
      const isDark = document.body.classList.toggle('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
    });
  });
});

// Navbar scroll
window.addEventListener('scroll', () => {
  const nb = document.getElementById('navbar');
  if (window.scrollY > 20) nb.classList.add('scrolled');
  else nb.classList.remove('scrolled');
});

// ─── BURGER MENU ───
function toggleMenu() {
  const nav = document.getElementById('mobile-nav');
  const overlay = document.getElementById('mobile-overlay');
  const burger = document.getElementById('burger');
  const isOpen = nav.classList.contains('open');
  if (isOpen) {
    closeMenu();
  } else {
    nav.classList.add('open');
    overlay.classList.add('active');
    burger.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
}
function closeMenu() {
  document.getElementById('mobile-nav').classList.remove('open');
  document.getElementById('mobile-overlay').classList.remove('active');
  document.getElementById('burger').classList.remove('open');
  document.body.style.overflow = '';
}

// Reveal on scroll
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('visible'); }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// FAQ toggle
function toggleFaq(btn) {
  const item = btn.parentElement;
  const isOpen = item.classList.contains('open');
  document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
  if (!isOpen) item.classList.add('open');
}

// Counter animation
function animateCounter(el) {
  const target = parseFloat(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const isDecimal = target % 1 !== 0;
  const duration = 2000;
  const steps = 60;
  const increment = target / steps;
  let current = 0;
  let count = 0;
  const timer = setInterval(() => {
    current += increment;
    count++;
    if (count >= steps) {
      current = target;
      clearInterval(timer);
    }
    if (target >= 1000) {
      el.textContent = Math.round(current).toLocaleString() + suffix;
    } else if (isDecimal) {
      el.textContent = current.toFixed(1) + suffix;
    } else {
      el.textContent = Math.round(current) + suffix;
    }
  }, duration / steps);
}

const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.querySelectorAll('.stat-num').forEach(animateCounter);
      counterObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.3 });
const statsGrid = document.querySelector('.stats-grid');
if (statsGrid) counterObserver.observe(statsGrid);

// Popup
function openPopup() {
  document.getElementById('popup-overlay').classList.add('active');
  document.body.style.overflow = 'hidden';
}
function closePopup() {
  document.getElementById('popup-overlay').classList.remove('active');
  document.body.style.overflow = '';
}
function closePopupOnBg(e) {
  if (e.target === document.getElementById('popup-overlay')) closePopup();
}
document.addEventListener('keydown', e => { if (e.key === 'Escape') closePopup(); });

// Forms
// Paste your Google Apps Script Web App URL here after publishing the backend.
const FORM_ENDPOINT = 'https://script.google.com/macros/s/AKfycbw5BicLFqMyfBIVikAvzcv59jwTasunHhVSPMnv3BMldMGlJ-bfdwC6EJCycXeQaTTD/exec';

function syncServiceChip(input) {
  const chip = input.closest('.service-chip');
  if (!chip) return;
  chip.classList.toggle('is-selected', input.checked);
}

function syncServiceChips(root = document) {
  root.querySelectorAll('.service-chip-input').forEach(syncServiceChip);
}

function getSelectedServices(form) {
  return Array.from(form.querySelectorAll('.service-chip-input:checked')).map(input => input.value);
}

function validateServiceGroups(form) {
  let isValid = true;
  form.querySelectorAll('[data-service-group]').forEach(group => {
    const hasSelection = group.querySelectorAll('.service-chip-input:checked').length > 0;
    group.classList.toggle('has-error', !hasSelection);
    if (!hasSelection) isValid = false;
  });

  if (!isValid) {
    const firstInput = form.querySelector('[data-service-group].has-error .service-chip-input');
    if (firstInput) firstInput.focus();
  }

  return isValid;
}

document.addEventListener('DOMContentLoaded', () => {
  syncServiceChips();
  document.querySelectorAll('.service-chip-input').forEach(input => {
    input.addEventListener('change', () => {
      syncServiceChip(input);
      const group = input.closest('[data-service-group]');
      if (group) group.classList.remove('has-error');
    });
  });
});

async function submitLeadForm(form) {
  const endpoint = FORM_ENDPOINT.trim();
  const payload = new FormData(form);
  const selectedServices = getSelectedServices(form);

  if (selectedServices.length) {
    const serviceValue = selectedServices.join(', ');
    payload.delete('services[]');
    payload.delete('service');
    payload.append('services', serviceValue);
    payload.append('service', serviceValue);
  }

  payload.append('formSource', form.dataset.formName || 'Website enquiry');
  payload.append('pageUrl', window.location.href);
  payload.append('submittedAt', new Date().toISOString());

  if (!endpoint) {
    console.warn('FORM_ENDPOINT is empty. Add your backend URL in assets/js/script.js.');
    return { configured: false };
  }

  const body = new URLSearchParams(payload);
  const isGoogleScript = endpoint.includes('script.google.com') || endpoint.includes('script.googleusercontent.com');
  await fetch(endpoint, {
    method: 'POST',
    body,
    mode: isGoogleScript ? 'no-cors' : 'cors'
  });

  return { configured: true };
}

async function handleForm(e) {
  e.preventDefault();
  const form = e.currentTarget;
  if (!validateServiceGroups(form)) return;

  const btn = form.querySelector('button[type=submit]');
  const originalText = btn.textContent;
  btn.textContent = 'Sending...';
  btn.disabled = true;

  try {
    const result = await submitLeadForm(form);
    if (!result.configured) {
      btn.textContent = 'Connect backend endpoint in assets/js/script.js';
      return;
    }
    btn.textContent = 'Sent! We will be in touch within 4 hours.';
    btn.style.background = '#3DD68C';
    form.reset();
    syncServiceChips(form);
    setTimeout(() => {
      btn.textContent = originalText;
      btn.style.background = '';
      btn.disabled = false;
    }, 3000);
  } catch (error) {
    console.error(error);
    btn.textContent = originalText;
    btn.disabled = false;
    alert('Something went wrong. Please try again or contact us on WhatsApp.');
  }
}

async function handlePopupForm(e) {
  e.preventDefault();
  const form = e.currentTarget;
  if (!validateServiceGroups(form)) return;

  const btn = form.querySelector('button[type=submit]');
  const originalText = btn.textContent;
  btn.textContent = 'Sending...';
  btn.disabled = true;

  try {
    const result = await submitLeadForm(form);
    if (!result.configured) {
      btn.textContent = 'Connect backend endpoint in assets/js/script.js';
      return;
    }
    btn.textContent = 'Request sent!';
    form.reset();
    syncServiceChips(form);
    setTimeout(() => {
      closePopup();
      btn.textContent = originalText;
      btn.disabled = false;
    }, 1500);
  } catch (error) {
    console.error(error);
    btn.textContent = originalText;
    btn.disabled = false;
    alert('Something went wrong. Please try again or contact us on WhatsApp.');
  }
}

// About page tabs
document.querySelectorAll('.about-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const tab = btn.dataset.tab;
    document.querySelectorAll('.about-tab-btn').forEach(item => item.classList.remove('active'));
    document.querySelectorAll('.about-tab-panel').forEach(panel => {
      panel.classList.toggle('active', panel.dataset.panel === tab);
    });
    btn.classList.add('active');
  });
});

function toggleBlogFaq(btn) {
  const item = btn.closest('.blog-faq-item');
  const faqSection = btn.closest('.blog-faq-section');
  if (!item || !faqSection) return;

  const shouldOpen = !item.classList.contains('open');
  faqSection.querySelectorAll('.blog-faq-item').forEach(faqItem => {
    faqItem.classList.remove('open');
    const question = faqItem.querySelector('.blog-faq-question');
    if (question) question.setAttribute('aria-expanded', 'false');
  });

  if (shouldOpen) {
    item.classList.add('open');
    btn.setAttribute('aria-expanded', 'true');
  }
}

// Portfolio page filters
document.querySelectorAll('.portfolio-filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const filter = btn.dataset.filter;
    document.querySelectorAll('.portfolio-filter-btn').forEach(item => item.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.portfolio-showcase-card').forEach(card => {
      const shouldShow = filter === 'all' || card.dataset.category === filter;
      card.classList.toggle('is-hidden', !shouldShow);
    });
  });
});
