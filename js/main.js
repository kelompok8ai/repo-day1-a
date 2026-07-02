/* Bank Sumut Corporate Secretary – Main JavaScript */

import { initNasakahDinas } from './nasakah-dinas.js';

const NEWS_DATA = [
  {
    id: 1,
    title: 'Bank Sumut Raih Penghargaan Digital Banking Terbaik 2026',
    excerpt: 'Bank Sumut kembali membuktikan komitmen transformasi digital dengan meraih penghargaan Digital Banking Excellence dari Otoritas Jasa Keuangan.',
    date: '28 Juni 2026',
    category: 'Penghargaan',
    image: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=400&fit=crop&q=80',
  },
  {
    id: 2,
    title: 'Program Literasi Keuangan untuk 5.000 Pelajar Sumut',
    excerpt: 'Corporate Secretary menggelar program edukasi keuangan di 25 sekolah menengah di seluruh Sumatera Utara sebagai bagian dari komitmen CSR.',
    date: '25 Juni 2026',
    category: 'Literasi Keuangan',
    image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a41?w=600&h=400&fit=crop&q=80',
  },
  {
    id: 3,
    title: 'Bank Sumut Luncurkan Fitur Mobile Banking Generasi Baru',
    excerpt: 'Aplikasi mobile banking terbaru menghadirkan pengalaman transaksi yang lebih aman, cepat, dan mudah bagi nasabah Bank Sumut.',
    date: '20 Juni 2026',
    category: 'Digital Banking',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&h=400&fit=crop&q=80',
  },
  {
    id: 4,
    title: 'Bantuan Pendidikan untuk 500 Anak Yatim Piatu',
    excerpt: 'Program CSR Bank Sumut menyalurkan beasiswa pendidikan dan perlengkapan sekolah bagi anak yatim piatu di 10 kabupaten/kota.',
    date: '15 Juni 2026',
    category: 'CSR',
    image: 'https://images.unsplash.com/photo-1497486751825-1233686d5d80?w=600&h=400&fit=crop&q=80',
  },
  {
    id: 5,
    title: 'Konferensi Pers Kinerja Keuangan Kuartal I 2026',
    excerpt: 'Direksi Bank Sumut menyampaikan capaian kinerja keuangan kuartal pertama 2026 dalam konferensi pers yang dihadiri media nasional.',
    date: '10 Juni 2026',
    category: 'Berita',
    image: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&h=400&fit=crop&q=80',
  },
  {
    id: 6,
    title: 'Bank Sumut Dukung 1.000 UMKM Melalui Program KUR',
    excerpt: 'Program kredit usaha rakyat Bank Sumut telah membantu lebih dari 1.000 pelaku UMKM di Sumatera Utara mengembangkan usahanya.',
    date: '5 Juni 2026',
    category: 'Berita',
    image: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=600&h=400&fit=crop&q=80',
  },
];

const PRESS_DATA = [
  { id: 1, title: 'Bank Sumut Catat Pertumbuhan Laba 15% di Kuartal I 2026', excerpt: 'Laporan keuangan menunjukkan pertumbuhan positif di seluruh segmen bisnis.', date: '10 Juni 2026', year: '2026', category: 'Keuangan' },
  { id: 2, title: 'Peluncuran Program Green Banking Bank Sumut', excerpt: 'Inisiatif keberlanjutan lingkungan melalui produk perbankan hijau.', date: '5 Juni 2026', year: '2026', category: 'Korporat' },
  { id: 3, title: 'Kerja Sama Strategis dengan Pemerintah Provinsi Sumut', excerpt: 'Penandatanganan MoU untuk pembangunan infrastruktur daerah.', date: '28 Mei 2026', year: '2026', category: 'Korporat' },
  { id: 4, title: 'Bank Sumut Salurkan Bantuan Bencana Alam Sebesar Rp 2 Miliar', excerpt: 'Bantuan untuk korban bencana di wilayah Sumatera Utara.', date: '15 Mei 2026', year: '2026', category: 'CSR' },
  { id: 5, title: 'Inovasi QRIS Merchant untuk UMKM Sumatera Utara', excerpt: 'Program digitalisasi pembayaran bagi 10.000 merchant UMKM.', date: '1 Mei 2026', year: '2026', category: 'Digital' },
  { id: 6, title: 'Laporan Tahunan Bank Sumut 2025 Dirilis', excerpt: 'Publikasi laporan tahunan dan sustainability report 2025.', date: '20 April 2026', year: '2026', category: 'Korporat' },
  { id: 7, title: 'Bank Sumut Raih Rating idAAA dari Pefindo', excerpt: 'Peringkat kredit tertinggi untuk obligasi Bank Sumut.', date: '10 Maret 2025', year: '2025', category: 'Keuangan' },
  { id: 8, title: 'Program Beasiswa Bank Sumut untuk 200 Mahasiswa', excerpt: 'Program beasiswa pendidikan tinggi bagi mahasiswa berprestasi.', date: '5 Februari 2025', year: '2025', category: 'CSR' },
];

const MEDIA_DATA = [
  { id: 1, title: 'Kantor Pusat Bank Sumut', category: 'foto', type: 'image', src: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=500&h=350&fit=crop&q=80', height: 350 },
  { id: 2, title: 'Konferensi Pers 2026', category: 'foto', type: 'image', src: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=500&h=280&fit=crop&q=80', height: 280 },
  { id: 3, title: 'Logo Bank Sumut', category: 'logo', type: 'doc', icon: '🏦' },
  { id: 4, title: 'Program CSR Pendidikan', category: 'foto', type: 'image', src: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=500&h=400&fit=crop&q=80', height: 400 },
  { id: 5, title: 'Corporate Video 2026', category: 'video', type: 'image', src: 'https://images.unsplash.com/photo-1492619375914-88005aa9e8fb?w=500&h=300&fit=crop&q=80', height: 300 },
  { id: 6, title: 'Press Kit Bank Sumut', category: 'press-kit', type: 'doc', icon: '📁' },
  { id: 7, title: 'Brand Guideline', category: 'brand', type: 'doc', icon: '🎨' },
  { id: 8, title: 'Laporan Tahunan 2025', category: 'dokumen', type: 'doc', icon: '📄' },
  { id: 9, title: 'Digital Banking Launch', category: 'foto', type: 'image', src: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=500&h=320&fit=crop&q=80', height: 320 },
];

const CSR_DATA = [
  { id: 1, title: 'Beasiswa Pendidikan Sumut Cerdas', category: 'Pendidikan', desc: 'Program beasiswa untuk siswa berprestasi dari keluarga kurang mampu di seluruh Sumatera Utara.', image: 'https://images.unsplash.com/photo-1427504494784-3a9ca7044f45?w=600&h=400&fit=crop&q=80', stats: [{ value: '2.500', label: 'Penerima' }, { value: '25', label: 'Kab/Kota' }] },
  { id: 2, title: 'Pemberdayaan UMKM Lokal', category: 'UMKM', desc: 'Pelatihan, pendampingan, dan akses permodalan bagi pelaku UMKM di wilayah Sumatera Utara.', image: 'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=600&h=400&fit=crop&q=80', stats: [{ value: '1.200', label: 'UMKM' }, { value: 'Rp 50M', label: 'KUR' }] },
  { id: 3, title: 'Penghijauan dan Konservasi', category: 'Lingkungan', desc: 'Program penanaman 10.000 pohon dan edukasi lingkungan di kawasan hutan lindung Sumatera Utara.', image: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?w=600&h=400&fit=crop&q=80', stats: [{ value: '10.000', label: 'Pohon' }, { value: '15', label: 'Lokasi' }] },
  { id: 4, title: 'Bantuan Sosial Masyarakat', category: 'Sosial', desc: 'Penyaluran bantuan sembako dan kebutuhan pokok bagi masyarakat kurang mampu.', image: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=600&h=400&fit=crop&q=80', stats: [{ value: '5.000', label: 'Keluarga' }, { value: '50', label: 'Desa' }] },
  { id: 5, title: 'Tanggap Bencana Alam', category: 'Bantuan Bencana', desc: 'Respons cepat bantuan kemanusiaan untuk korban bencana alam di Sumatera Utara.', image: 'https://images.unsplash.com/photo-1584438784890-1cf5164cc18e?w=600&h=400&fit=crop&q=80', stats: [{ value: 'Rp 5M', label: 'Bantuan' }, { value: '8', label: 'Bencana' }] },
  { id: 6, title: 'Literasi Keuangan Digital', category: 'Pendidikan', desc: 'Edukasi literasi keuangan dan keamanan digital bagi masyarakat dan pelajar.', image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=600&h=400&fit=crop&q=80', stats: [{ value: '8.000', label: 'Peserta' }, { value: '100', label: 'Sekolah' }] },
];

const AWARDS_DATA = [
  { id: 1, title: 'Digital Banking Excellence Award', year: '2026', category: 'digital', icon: '📱' },
  { id: 2, title: 'Best CSR Program – Banking Sector', year: '2026', category: 'csr', icon: '💚' },
  { id: 3, title: 'Service Excellence Award', year: '2025', category: 'service', icon: '⭐' },
  { id: 4, title: 'Innovation in Fintech Award', year: '2025', category: 'innovation', icon: '💡' },
  { id: 5, title: 'Best Regional Development Bank', year: '2025', category: 'national', icon: '🏆' },
  { id: 6, title: 'Top Employer Indonesia', year: '2024', category: 'national', icon: '👥' },
  { id: 7, title: 'Green Banking Initiative Award', year: '2024', category: 'csr', icon: '🌿' },
  { id: 8, title: 'Mobile Banking App of the Year', year: '2024', category: 'digital', icon: '📲' },
];

const CATEGORY_LABELS = {
  foto: 'Foto',
  video: 'Video',
  logo: 'Logo',
  'press-kit': 'Press Kit',
  brand: 'Brand Guideline',
  dokumen: 'Dokumen Publik',
};

/* DOM Elements */
const header = document.getElementById('header');
const navToggle = document.getElementById('navToggle');
const mainNav = document.getElementById('mainNav');
const themeToggle = document.getElementById('themeToggle');
const scrollProgress = document.getElementById('scrollProgress');
const backToTop = document.getElementById('backToTop');
const contactForm = document.getElementById('contactForm');

/* Theme */
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

/* Header Scroll */
function handleScroll() {
  const scrollY = window.scrollY;
  header?.classList.toggle('scrolled', scrollY > 50);

  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
  if (scrollProgress) scrollProgress.style.width = `${progress}%`;

  if (backToTop) backToTop.hidden = scrollY < 400;
}

/* Mobile Nav */
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

/* Active Nav Link */
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

/* Scroll Reveal */
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

/* Animated Counters */
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

/* Render News */
function renderNews() {
  const grid = document.getElementById('newsGrid');
  if (!grid) return;

  grid.innerHTML = NEWS_DATA.map(
    (item) => `
    <article class="news-card reveal">
      <div class="news-card__img">
        <img src="${item.image}" alt="${item.title}" loading="lazy" width="600" height="400" />
        <span class="news-card__category">${item.category}</span>
      </div>
      <div class="news-card__body">
        <time class="news-card__date" datetime="${item.date}">${item.date}</time>
        <h3 class="news-card__title">${item.title}</h3>
        <p class="news-card__excerpt">${item.excerpt}</p>
        <a href="#" class="news-card__link" aria-label="Selengkapnya: ${item.title}">Selengkapnya</a>
      </div>
    </article>
  `
  ).join('');

  initReveal();
}

/* Render Press Release */
function renderPress(filtered = PRESS_DATA) {
  const list = document.getElementById('pressList');
  if (!list) return;

  if (filtered.length === 0) {
    list.innerHTML = '<p style="text-align:center;color:var(--color-text-muted);padding:2rem;">Tidak ada press release yang ditemukan.</p>';
    return;
  }

  list.innerHTML = filtered
    .map(
      (item) => `
    <article class="press-item reveal">
      <div class="press-item__info">
        <div class="press-item__meta">
          <time datetime="${item.date}">${item.date}</time>
          <span class="press-item__category">${item.category}</span>
        </div>
        <h3 class="press-item__title">${item.title}</h3>
        <p class="press-item__excerpt">${item.excerpt}</p>
      </div>
      <div class="press-item__actions">
        <button class="press-btn" title="Unduh PDF" aria-label="Unduh PDF: ${item.title}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>
        </button>
        <button class="press-btn" title="Bagikan" aria-label="Bagikan: ${item.title}" data-share="${item.title}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98"/></svg>
        </button>
        <button class="press-btn" title="Detail" aria-label="Detail: ${item.title}">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </div>
    </article>
  `
    )
    .join('');

  list.querySelectorAll('[data-share]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const title = btn.dataset.share;
      if (navigator.share) {
        navigator.share({ title, url: window.location.href });
      } else {
        navigator.clipboard?.writeText(window.location.href);
        alert('Tautan telah disalin ke clipboard.');
      }
    });
  });

  initReveal();
}

function filterPress() {
  const search = document.getElementById('pressSearch')?.value.toLowerCase() || '';
  const year = document.getElementById('pressYearFilter')?.value || '';
  const category = document.getElementById('pressCategoryFilter')?.value || '';

  const filtered = PRESS_DATA.filter((item) => {
    const matchSearch = item.title.toLowerCase().includes(search) || item.excerpt.toLowerCase().includes(search);
    const matchYear = !year || item.year === year;
    const matchCategory = !category || item.category === category;
    return matchSearch && matchYear && matchCategory;
  });

  renderPress(filtered);
}

/* Render Media Gallery */
function renderMedia(filter = 'all') {
  const gallery = document.getElementById('mediaGallery');
  if (!gallery) return;

  const items = filter === 'all' ? MEDIA_DATA : MEDIA_DATA.filter((m) => m.category === filter);

  gallery.innerHTML = items
    .map((item) => {
      if (item.type === 'doc') {
        return `
        <div class="masonry-item masonry-item--doc" data-category="${item.category}">
          <span class="doc-icon">${item.icon}</span>
          <strong>${item.title}</strong>
          <span>${CATEGORY_LABELS[item.category] || item.category}</span>
        </div>`;
      }
      return `
      <div class="masonry-item" data-category="${item.category}">
        <img src="${item.src}" alt="${item.title}" loading="lazy" width="500" height="${item.height}" />
        <div class="masonry-item__overlay">
          <strong>${item.title}</strong>
          <span>${CATEGORY_LABELS[item.category] || item.category}</span>
        </div>
      </div>`;
    })
    .join('');
}

/* Render CSR */
function renderCSR() {
  const grid = document.getElementById('csrGrid');
  if (!grid) return;

  grid.innerHTML = CSR_DATA.map(
    (item) => `
    <article class="csr-card reveal">
      <div class="csr-card__img">
        <img src="${item.image}" alt="${item.title}" loading="lazy" width="600" height="400" />
      </div>
      <div class="csr-card__body">
        <span class="csr-card__category">${item.category}</span>
        <h3 class="csr-card__title">${item.title}</h3>
        <p class="csr-card__desc">${item.desc}</p>
        <div class="csr-card__stats">
          ${item.stats.map((s) => `<div class="csr-card__stat"><strong>${s.value}</strong><span>${s.label}</span></div>`).join('')}
        </div>
      </div>
    </article>
  `
  ).join('');

  initReveal();
}

/* Render Awards */
function renderAwards(filter = 'all') {
  const timeline = document.getElementById('awardsTimeline');
  if (!timeline) return;

  const items = filter === 'all' ? AWARDS_DATA : AWARDS_DATA.filter((a) => a.category === filter);

  timeline.innerHTML = items
    .map(
      (item) => `
    <div class="award-card reveal">
      <span class="award-card__year">${item.year}</span>
      <div class="award-card__icon">${item.icon}</div>
      <h3 class="award-card__title">${item.title}</h3>
      <span class="award-card__category">${item.category.replace('-', ' ')}</span>
    </div>
  `
    )
    .join('');

  initReveal();
}

/* Accordion */
function initAccordion() {
  document.querySelectorAll('.accordion__trigger').forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const item = trigger.parentElement;
      const isActive = item.classList.contains('active');

      document.querySelectorAll('.accordion__item').forEach((i) => {
        i.classList.remove('active');
        i.querySelector('.accordion__trigger')?.setAttribute('aria-expanded', 'false');
        const panel = i.querySelector('.accordion__panel');
        if (panel) panel.hidden = true;
      });

      if (!isActive) {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
        const panel = item.querySelector('.accordion__panel');
        if (panel) panel.hidden = false;
      }
    });
  });
}

/* Tab Filters */
function initTabs(selector, callback) {
  document.querySelectorAll(selector).forEach((tab) => {
    tab.addEventListener('click', () => {
      const parent = tab.closest('.section') || tab.parentElement;
      parent.querySelectorAll(selector).forEach((t) => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');
      callback(tab.dataset.filter);
    });
  });
}

/* Contact Form */
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

/* Back to Top */
backToTop?.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* Lazy load images with native loading=lazy is sufficient; add error fallback */
document.addEventListener('error', (e) => {
  if (e.target.tagName === 'IMG') {
    e.target.style.background = 'var(--color-gray-200)';
    e.target.alt = 'Gambar tidak tersedia';
  }
}, true);

/* Init */
function init() {
  initTheme();
  renderNews();
  renderPress();
  renderMedia();
  renderCSR();
  renderAwards();
  initAccordion();
  initReveal();
  initCounters();

  document.getElementById('pressSearch')?.addEventListener('input', filterPress);
  document.getElementById('pressYearFilter')?.addEventListener('change', filterPress);
  document.getElementById('pressCategoryFilter')?.addEventListener('change', filterPress);

  initTabs('.media-tab', renderMedia);
  initTabs('.awards-tab', renderAwards);

  initNasakahDinas();

  window.addEventListener('scroll', () => {
    handleScroll();
    updateActiveNav();
  }, { passive: true });

  handleScroll();
}

document.addEventListener('DOMContentLoaded', init);
