/* Bank Sumut Corporate Secretary – Main JavaScript */

import { initNasakahDinas } from './nasakah-dinas.js';
import { initDirekturSchedule } from './direktur-schedule.js';

const header = document.getElementById('header');
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
const themeToggle = document.getElementById('themeToggle');
const scrollProgress = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');
const contactForm = document.getElementById('contactForm');

function initTheme() {
  const saved = localStorage.getItem('theme');
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  if (saved === 'dark' || (!saved && prefersDark)) {
    document.documentElement.setAttribute('data-theme', 'dark');
  }
}

themeToggle?.addEventListener('click', () => {
  const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
  document.documentElement.setAttribute('data-theme', isDark ? 'light' : 'dark');
  localStorage.setItem('theme', isDark ? 'light' : 'dark');
});

function handleScroll() {
  const scrollY = window.scrollY;
  header?.classList.toggle('scrolled', scrollY > 50);

  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
  if (scrollProgress) scrollProgress.style.width = `${progress}%`;

  if (backToTop) backToTop.hidden = scrollY < 400;
}

navToggle?.addEventListener('click', () => {
  const isOpen = mainNav?.classList.toggle('open');
  navToggle.classList.toggle('active');
  navToggle.setAttribute('aria-expanded', String(isOpen));
  document.body.style.overflow = isOpen ? 'hidden' : '';
});

mainNav?.querySelectorAll('.nav__link').forEach((link) => {
  link.addEventListener('click', () => {
    mainNav?.classList.remove('open');
    navToggle?.classList.remove('active');
    navToggle?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  });
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 100;

  sections.forEach((section) => {
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const id = section.getAttribute('id');

    if (scrollPos >= top && scrollPos < top + height) {
      mainNav?.querySelectorAll('.nav__link').forEach((link) => {
        link.classList.toggle('active', link.getAttribute('href') === `#${id}`);
      });
    }
  });
}

function initReveal() {
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1, rootMargin: '0px 0px -50px 0px' }
  );
  reveals.forEach((el) => observer.observe(el));
}

function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const start = performance.now();

  function update(now) {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target).toLocaleString('id-ID');
    if (progress < 1) requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

function initCounters() {
  const counters = document.querySelectorAll('.counter');
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.animated) {
          entry.target.dataset.animated = 'true';
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.5 }
  );
  counters.forEach((el) => observer.observe(el));
}

contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const note = document.getElementById('formNote');
  const formData = new FormData(contactForm);

  if (!formData.get('name') || !formData.get('email') || !formData.get('subject') || !formData.get('message')) {
    if (note) {
      note.textContent = 'Mohon lengkapi semua field yang wajib diisi.';
      note.className = 'form-note error';
    }
    return;
  }

  if (note) {
    note.textContent = 'Terima kasih. Pesan Anda telah terkirim dan akan segera ditindaklanjuti.';
    note.className = 'form-note success';
  }
  contactForm.reset();
});

backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

document.addEventListener('error', (e) => {
  if (e.target.tagName === 'IMG') {
    e.target.style.background = 'var(--color-gray-200)';
    e.target.alt = 'Gambar tidak tersedia';
  }
}, true);

function init() {
  initTheme();
  initNasakahDinas();
  initDirekturSchedule();
  initReveal();
  initCounters();

  window.addEventListener('scroll', () => {
    handleScroll();
    updateActiveNav();
  }, { passive: true });

  handleScroll();
}

document.addEventListener('DOMContentLoaded', init);
