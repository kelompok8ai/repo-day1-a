/**
 * Modul Resume Memo Nasakah Dinas
 * Terintegrasi regulasi Bank Sumut, BI, OJK, dan UU RI
 */

import {
  DIVISIONS,
  DOC_TYPES,
  CLASSIFICATIONS,
  TOPICS,
  REGULATIONS,
  SOURCE_LABELS,
  suggestRegulations,
  filterRegulations,
  validateCompliance,
  getRegulationById,
} from './regulations.js';

const STEPS = [
  { id: 1, label: 'Identitas', icon: '1' },
  { id: 2, label: 'Isi Memo', icon: '2' },
  { id: 3, label: 'Regulasi', icon: '3' },
  { id: 4, label: 'Validasi', icon: '4' },
  { id: 5, label: 'Preview', icon: '5' },
];

const state = {
  step: 1,
  division: '',
  unitKerja: '',
  pembuat: '',
  jabatan: '',
  docType: 'resume-memo',
  topic: '',
  klasifikasi: 'internal',
  perihal: '',
  kepada: '',
  tanggal: new Date().toISOString().split('T')[0],
  nomorDraft: '',
  latarBelakang: '',
  maksud: '',
  dasarHukum: '',
  analisis: '',
  rekomendasi: '',
  selectedRegulations: [],
  complianceAcknowledged: false,
};

function getEl(id) {
  return document.getElementById(id);
}

function generateDraftNumber() {
  const div = DIVISIONS.find((d) => d.id === state.division);
  const code = div?.code || 'BSUM';
  const date = new Date();
  const y = date.getFullYear();
  const seq = String(Math.floor(Math.random() * 900) + 100);
  return `ND/${code}/${seq}/${y}`;
}

function renderStepIndicator() {
  const el = getEl('nasakahSteps');
  if (!el) return;

  el.innerHTML = STEPS.map(
    (s) => `
    <div class="nasakah-step ${state.step === s.id ? 'active' : ''} ${state.step > s.id ? 'done' : ''}" data-step="${s.id}">
      <span class="nasakah-step__num">${state.step > s.id ? '✓' : s.id}</span>
      <span class="nasakah-step__label">${s.label}</span>
    </div>
  `
  ).join('');
}

function renderStep1() {
  return `
    <div class="nasakah-panel" data-panel="1">
      <h3 class="nasakah-panel__title">Identitas Pengirim & Dokumen</h3>
      <p class="nasakah-panel__desc">Lengkapi informasi divisi/unit kerja pengirim dan jenis naskah dinas.</p>
      <div class="nasakah-form-grid">
        <div class="form-group">
          <label for="nasDivision">Divisi / Bidang <span>*</span></label>
          <select id="nasDivision" required>
            <option value="">Pilih divisi</option>
            ${DIVISIONS.map((d) => `<option value="${d.id}" ${state.division === d.id ? 'selected' : ''}>${d.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label for="nasUnit">Unit Kerja / Sub-bidang</label>
          <input type="text" id="nasUnit" value="${state.unitKerja}" placeholder="Contoh: Sub-bidang Compliance I" />
        </div>
        <div class="form-group">
          <label for="nasPembuat">Nama Pembuat <span>*</span></label>
          <input type="text" id="nasPembuat" value="${state.pembuat}" required placeholder="Nama lengkap pegawai" />
        </div>
        <div class="form-group">
          <label for="nasJabatan">Jabatan <span>*</span></label>
          <input type="text" id="nasJabatan" value="${state.jabatan}" required placeholder="Contoh: Kepala Sub-bidang" />
        </div>
        <div class="form-group">
          <label for="nasDocType">Jenis Naskah Dinas <span>*</span></label>
          <select id="nasDocType" required>
            ${DOC_TYPES.map((d) => `<option value="${d.id}" ${state.docType === d.id ? 'selected' : ''}>${d.name}</option>`).join('')}
          </select>
          <small class="form-hint" id="nasDocTypeHint">${DOC_TYPES.find((d) => d.id === state.docType)?.desc || ''}</small>
        </div>
        <div class="form-group">
          <label for="nasTopic">Topik / Kategori <span>*</span></label>
          <select id="nasTopic" required>
            <option value="">Pilih topik</option>
            ${TOPICS.map((t) => `<option value="${t.id}" ${state.topic === t.id ? 'selected' : ''}>${t.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label for="nasKlasifikasi">Klasifikasi Dokumen <span>*</span></label>
          <select id="nasKlasifikasi" required>
            ${CLASSIFICATIONS.map((c) => `<option value="${c.id}" ${state.klasifikasi === c.id ? 'selected' : ''}>${c.name}</option>`).join('')}
          </select>
        </div>
        <div class="form-group">
          <label for="nasTanggal">Tanggal <span>*</span></label>
          <input type="date" id="nasTanggal" value="${state.tanggal}" required />
        </div>
        <div class="form-group form-group--full">
          <label for="nasPerihal">Perihal <span>*</span></label>
          <input type="text" id="nasPerihal" value="${state.perihal}" required placeholder="Ringkas dan jelas, minimal 10 karakter" />
        </div>
        <div class="form-group form-group--full">
          <label for="nasKepada">Kepada Yth.</label>
          <input type="text" id="nasKepada" value="${state.kepada}" placeholder="Contoh: Direktur Utama / Direktur Operasional" />
        </div>
      </div>
    </div>`;
}

function renderStep2() {
  return `
    <div class="nasakah-panel" data-panel="2">
      <h3 class="nasakah-panel__title">Isi Resume Memo Nasakah Dinas</h3>
      <p class="nasakah-panel__desc">Susun isi memo sesuai SE.024/CORSEC/2025 – Petunjuk Penyusunan Resume Memo Nasakah Dinas.</p>
      <div class="nasakah-form-stack">
        <div class="form-group">
          <label for="nasLatar">I. Latar Belakang <span>*</span></label>
          <textarea id="nasLatar" rows="4" required placeholder="Uraikan latar belakang permasalahan atau kebutuhan...">${state.latarBelakang}</textarea>
          <small class="form-hint">Minimal 50 karakter. Jelaskan konteks dan urgensi.</small>
        </div>
        <div class="form-group">
          <label for="nasMaksud">II. Maksud & Tujuan <span>*</span></label>
          <textarea id="nasMaksud" rows="3" required placeholder="Tujuan penyusunan memo ini...">${state.maksud}</textarea>
        </div>
        <div class="form-group">
          <label for="nasDasar">III. Dasar Hukum / Regulasi (Narasi)</label>
          <textarea id="nasDasar" rows="3" placeholder="Uraian singkat dasar hukum yang mendasari memo...">${state.dasarHukum}</textarea>
          <small class="form-hint">Referensi detail regulasi akan dipilih pada langkah berikutnya.</small>
        </div>
        <div class="form-group">
          <label for="nasAnalisis">IV. Analisis / Pembahasan <span>*</span></label>
          <textarea id="nasAnalisis" rows="5" required placeholder="Analisis permasalahan, implikasi, dan pertimbangan...">${state.analisis}</textarea>
        </div>
        <div class="form-group">
          <label for="nasRekomendasi">V. Rekomendasi / Kesimpulan <span>*</span></label>
          <textarea id="nasRekomendasi" rows="4" required placeholder="Rekomendasi tindak lanjut yang diusulkan...">${state.rekomendasi}</textarea>
        </div>
      </div>
    </div>`;
}

function renderRegulationCard(reg, selected) {
  const sourceClass = `reg-card--${reg.source}`;
  return `
    <label class="reg-card ${sourceClass} ${selected ? 'selected' : ''}">
      <input type="checkbox" name="regulation" value="${reg.id}" ${selected ? 'checked' : ''} />
      <div class="reg-card__header">
        <span class="reg-card__badge">${reg.type}</span>
        <span class="reg-card__source">${SOURCE_LABELS[reg.source]}</span>
      </div>
      <strong class="reg-card__number">${reg.number}</strong>
      <p class="reg-card__title">${reg.title}</p>
      <p class="reg-card__summary">${reg.summary}</p>
      <div class="reg-card__articles">
        ${reg.articles.map((a) => `<span>${a}</span>`).join('')}
      </div>
    </label>`;
}

function renderStep3() {
  const suggested = suggestRegulations(state.topic, state.division, state.docType);
  const suggestedIds = new Set(suggested.map((r) => r.id));

  // Auto-select suggested if empty
  if (state.selectedRegulations.length === 0 && suggested.length) {
    state.selectedRegulations = suggested.map((r) => r.id);
  }

  const filtered = filterRegulations(
    getEl('regSearch')?.value || '',
    getEl('regSourceFilter')?.value || 'all'
  );

  return `
    <div class="nasakah-panel" data-panel="3">
      <h3 class="nasakah-panel__title">Referensi Regulasi Terintegrasi</h3>
      <p class="nasakah-panel__desc">Pilih regulasi Bank Sumut (SK/SE), BI, OJK, dan peraturan perundang-undangan yang relevan.</p>

      <div class="reg-suggested glass-card">
        <h4>Rekomendasi Otomatis <span class="reg-count">${suggested.length} regulasi</span></h4>
        <p>Berdasarkan topik <strong>${TOPICS.find((t) => t.id === state.topic)?.name || '-'}</strong> dan divisi <strong>${DIVISIONS.find((d) => d.id === state.division)?.name || '-'}</strong></p>
        <div class="reg-suggested__list">
          ${suggested.map((r) => `<span class="reg-tag reg-tag--${r.source}">${r.number}</span>`).join('')}
        </div>
        <button type="button" class="btn btn--sm btn--outline" id="applySuggested">Terapkan Semua Rekomendasi</button>
      </div>

      <div class="reg-toolbar">
        <div class="search-bar">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/></svg>
          <input type="search" id="regSearch" placeholder="Cari regulasi (nomor, judul, kata kunci)..." aria-label="Cari regulasi" />
        </div>
        <select id="regSourceFilter" aria-label="Filter sumber regulasi">
          <option value="all">Semua Sumber</option>
          <option value="banksumut">Bank Sumut (SK/SE)</option>
          <option value="bi">Bank Indonesia</option>
          <option value="ojk">OJK</option>
          <option value="uu">Perundang-undangan RI</option>
        </select>
      </div>

      <div class="reg-stats">
        <span class="reg-stat reg-stat--banksumut">Bank Sumut: ${REGULATIONS.filter((r) => r.source === 'banksumut').length}</span>
        <span class="reg-stat reg-stat--bi">BI: ${REGULATIONS.filter((r) => r.source === 'bi').length}</span>
        <span class="reg-stat reg-stat--ojk">OJK: ${REGULATIONS.filter((r) => r.source === 'ojk').length}</span>
        <span class="reg-stat reg-stat--uu">UU/PP: ${REGULATIONS.filter((r) => r.source === 'uu').length}</span>
        <span class="reg-stat reg-stat--selected">Terpilih: <strong id="regSelectedCount">${state.selectedRegulations.length}</strong></span>
      </div>

      <div class="reg-grid" id="regGrid">
        ${filtered.map((r) => renderRegulationCard(r, state.selectedRegulations.includes(r.id))).join('')}
      </div>
    </div>`;
}

function renderStep4() {
  const results = validateCompliance(state);
  const allPassed = results.every((r) => r.passed);
  const passedCount = results.filter((r) => r.passed).length;

  return `
    <div class="nasakah-panel" data-panel="4">
      <h3 class="nasakah-panel__title">Validasi Kepatuhan Regulasi</h3>
      <p class="nasakah-panel__desc">Pemeriksaan otomatis terhadap ketentuan Bank Sumut, regulator, dan peraturan yang berlaku.</p>

      <div class="compliance-summary ${allPassed ? 'compliance-summary--pass' : 'compliance-summary--fail'}">
        <div class="compliance-summary__icon">${allPassed ? '✅' : '⚠️'}</div>
        <div>
          <strong>${passedCount}/${results.length} Aturan Kepatuhan Terpenuhi</strong>
          <p>${allPassed ? 'Dokumen memenuhi seluruh persyaratan kepatuhan. Lanjutkan ke preview.' : 'Terdapat ketidaksesuaian. Perbaiki sebelum melanjutkan.'}</p>
        </div>
      </div>

      <div class="compliance-list">
        ${results
          .map(
            (r) => `
          <div class="compliance-item ${r.passed ? 'compliance-item--pass' : 'compliance-item--fail'}">
            <span class="compliance-item__icon">${r.passed ? '✓' : '✗'}</span>
            <div class="compliance-item__body">
              <strong>${r.label}</strong>
              ${!r.passed ? `<p class="compliance-item__msg">${r.message}</p>` : ''}
              ${r.regulation ? `<small>Rujukan: ${r.regulation.number} – ${r.regulation.title}</small>` : ''}
            </div>
          </div>`
          )
          .join('')}
      </div>

      <label class="compliance-ack">
        <input type="checkbox" id="nasComplianceAck" ${state.complianceAcknowledged ? 'checked' : ''} ${!allPassed ? 'disabled' : ''} />
        <span>Saya menyatakan bahwa naskah dinas ini telah disusun sesuai ketentuan Bank Sumut, regulasi BI/OJK, dan peraturan perundang-undangan yang berlaku.</span>
      </label>
    </div>`;
}

function formatDateID(dateStr) {
  if (!dateStr) return '-';
  const months = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const d = new Date(dateStr);
  return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function renderPreview() {
  const div = DIVISIONS.find((d) => d.id === state.division);
  const docType = DOC_TYPES.find((d) => d.id === state.docType);
  const klasifikasi = CLASSIFICATIONS.find((c) => c.id === state.klasifikasi);
  const topic = TOPICS.find((t) => t.id === state.topic);
  const regs = state.selectedRegulations.map(getRegulationById).filter(Boolean);

  if (!state.nomorDraft) state.nomorDraft = generateDraftNumber();

  return `
    <div class="nasakah-panel" data-panel="5">
      <div class="preview-actions no-print">
        <button type="button" class="btn btn--primary" id="nasPrint">Cetak / Simpan PDF</button>
        <button type="button" class="btn btn--outline" id="nasCopy">Salin Teks</button>
        <button type="button" class="btn btn--outline" id="nasReset">Buat Baru</button>
      </div>

      <article class="memo-preview" id="memoPreview">
        <header class="memo-preview__header">
          <div class="memo-preview__logo">
            <strong>PT BANK PEMBANGUNAN DAERAH SUMATERA UTARA</strong>
            <span>(Bank Sumut)</span>
          </div>
          <div class="memo-preview__meta">
            <table>
              <tr><td>Nomor</td><td>: ${state.nomorDraft}</td></tr>
              <tr><td>Klasifikasi</td><td>: ${klasifikasi?.name || '-'}</td></tr>
              <tr><td>Lampiran</td><td>: -</td></tr>
              <tr><td>Perihal</td><td>: <strong>${state.perihal || '-'}</strong></td></tr>
            </table>
          </div>
        </header>

        <div class="memo-preview__address">
          <p>Kepada Yth.<br /><strong>${state.kepada || 'Direksi Bank Sumut'}</strong><br />di Tempat</p>
          <p class="memo-preview__date">Medan, ${formatDateID(state.tanggal)}</p>
        </div>

        <div class="memo-preview__type">
          <h2>${docType?.name?.toUpperCase() || 'RESUME MEMO NASAKAH DINAS'}</h2>
          <p class="memo-preview__topic">Topik: ${topic?.name || '-'} | Divisi: ${div?.name || '-'}${state.unitKerja ? ` / ${state.unitKerja}` : ''}</p>
        </div>

        <section class="memo-preview__section">
          <h3>I. Latar Belakang</h3>
          <p>${state.latarBelakang || '-'}</p>
        </section>

        <section class="memo-preview__section">
          <h3>II. Maksud & Tujuan</h3>
          <p>${state.maksud || '-'}</p>
        </section>

        <section class="memo-preview__section">
          <h3>III. Dasar Hukum</h3>
          ${state.dasarHukum ? `<p>${state.dasarHukum}</p>` : ''}
          <ol class="memo-preview__regs">
            ${regs.map((r) => `<li><strong>${r.number}</strong> – ${r.title} (${SOURCE_LABELS[r.source]})</li>`).join('')}
          </ol>
        </section>

        <section class="memo-preview__section">
          <h3>IV. Analisis / Pembahasan</h3>
          <p>${state.analisis || '-'}</p>
        </section>

        <section class="memo-preview__section">
          <h3>V. Rekomendasi / Kesimpulan</h3>
          <p>${state.rekomendasi || '-'}</p>
        </section>

        <footer class="memo-preview__footer">
          <p>Demikian resume memo nasakah dinas ini disampaikan untuk menjadi perhatian dan arahan Bapak/Ibu.</p>
          <div class="memo-preview__sign">
            <p>Hormat kami,</p>
            <div class="memo-preview__sign-space"></div>
            <p><strong>${state.pembuat || '[Nama Pembuat]'}</strong><br />${state.jabatan || '[Jabatan]'}</p>
          </div>
        </footer>

        <div class="memo-preview__stamp">
          <small>Dokumen ini disusun melalui Sistem Nasakah Dinas Terintegrasi Corporate Secretary – Bank Sumut</small>
          <small>Validasi kepatuhan: ${state.complianceAcknowledged ? 'Disetujui pembuat' : 'Draft'} | ${new Date().toLocaleString('id-ID')}</small>
        </div>
      </article>
    </div>`;
}

function renderCurrentStep() {
  const content = getEl('nasakahContent');
  if (!content) return;

  renderStepIndicator();

  let html = '';
  switch (state.step) {
    case 1: html = renderStep1(); break;
    case 2: html = renderStep2(); break;
    case 3: html = renderStep3(); break;
    case 4: html = renderStep4(); break;
    case 5: html = renderPreview(); break;
    default: html = renderStep1();
  }

  content.innerHTML = html;
  bindStepEvents();
  updateNavButtons();
}

function readStep1() {
  state.division = getEl('nasDivision')?.value || '';
  state.unitKerja = getEl('nasUnit')?.value || '';
  state.pembuat = getEl('nasPembuat')?.value || '';
  state.jabatan = getEl('nasJabatan')?.value || '';
  state.docType = getEl('nasDocType')?.value || 'resume-memo';
  state.topic = getEl('nasTopic')?.value || '';
  state.klasifikasi = getEl('nasKlasifikasi')?.value || 'internal';
  state.tanggal = getEl('nasTanggal')?.value || state.tanggal;
  state.perihal = getEl('nasPerihal')?.value || '';
  state.kepada = getEl('nasKepada')?.value || '';
}

function readStep2() {
  state.latarBelakang = getEl('nasLatar')?.value || '';
  state.maksud = getEl('nasMaksud')?.value || '';
  state.dasarHukum = getEl('nasDasar')?.value || '';
  state.analisis = getEl('nasAnalisis')?.value || '';
  state.rekomendasi = getEl('nasRekomendasi')?.value || '';
}

function readStep3() {
  const checked = document.querySelectorAll('input[name="regulation"]:checked');
  state.selectedRegulations = [...checked].map((c) => c.value);
}

function validateStep1() {
  readStep1();
  if (!state.division || !state.pembuat || !state.jabatan || !state.topic || !state.perihal) {
    alert('Mohon lengkapi semua field wajib (*).');
    return false;
  }
  if (state.perihal.length < 10) {
    alert('Perihal minimal 10 karakter.');
    return false;
  }
  return true;
}

function validateStep2() {
  readStep2();
  if (!state.latarBelakang || !state.maksud || !state.analisis || !state.rekomendasi) {
    alert('Mohon lengkapi semua bagian resume memo.');
    return false;
  }
  if (state.latarBelakang.length < 50) {
    alert('Latar belakang minimal 50 karakter.');
    return false;
  }
  return true;
}

function validateStep3() {
  readStep3();
  if (state.selectedRegulations.length < 1) {
    alert('Pilih minimal 1 referensi regulasi.');
    return false;
  }
  return true;
}

function validateStep4() {
  const results = validateCompliance(state);
  const allPassed = results.every((r) => r.passed);
  state.complianceAcknowledged = getEl('nasComplianceAck')?.checked || false;

  if (!allPassed) {
    alert('Perbaiki ketidaksesuaian kepatuhan sebelum melanjutkan.');
    return false;
  }
  if (!state.complianceAcknowledged) {
    alert('Centang pernyataan kepatuhan untuk melanjutkan.');
    return false;
  }
  return true;
}

function updateNavButtons() {
  const prev = getEl('nasPrev');
  const next = getEl('nasNext');
  if (prev) prev.hidden = state.step === 1;
  if (next) {
    next.textContent = state.step === 5 ? 'Selesai' : state.step === 4 ? 'Lihat Preview' : 'Lanjutkan';
    next.hidden = state.step === 5;
  }
}

function bindStepEvents() {
  // Step 1 doc type hint
  getEl('nasDocType')?.addEventListener('change', (e) => {
    const hint = getEl('nasDocTypeHint');
    const doc = DOC_TYPES.find((d) => d.id === e.target.value);
    if (hint && doc) hint.textContent = doc.desc;
  });

  // Step 3 regulation events
  getEl('regSearch')?.addEventListener('input', () => {
    readStep3();
    renderCurrentStep();
  });

  getEl('regSourceFilter')?.addEventListener('change', () => {
    readStep3();
    renderCurrentStep();
  });

  getEl('applySuggested')?.addEventListener('click', () => {
    const suggested = suggestRegulations(state.topic, state.division, state.docType);
    state.selectedRegulations = suggested.map((r) => r.id);
    renderCurrentStep();
  });

  document.querySelectorAll('input[name="regulation"]').forEach((cb) => {
    cb.addEventListener('change', () => {
      readStep3();
      const countEl = getEl('regSelectedCount');
      if (countEl) countEl.textContent = state.selectedRegulations.length;
      cb.closest('.reg-card')?.classList.toggle('selected', cb.checked);
    });
  });

  getEl('nasComplianceAck')?.addEventListener('change', (e) => {
    state.complianceAcknowledged = e.target.checked;
  });

  // Step 5 actions
  getEl('nasPrint')?.addEventListener('click', () => window.print());
  getEl('nasCopy')?.addEventListener('click', copyMemoText);
  getEl('nasReset')?.addEventListener('click', resetNasakah);
}

function copyMemoText() {
  const preview = getEl('memoPreview');
  if (!preview) return;
  const text = preview.innerText;
  navigator.clipboard?.writeText(text).then(() => alert('Teks memo telah disalin ke clipboard.'));
}

function resetNasakah() {
  if (!confirm('Reset form dan buat naskah baru?')) return;
  Object.assign(state, {
    step: 1,
    division: '', unitKerja: '', pembuat: '', jabatan: '',
    docType: 'resume-memo', topic: '', klasifikasi: 'internal',
    perihal: '', kepada: '', tanggal: new Date().toISOString().split('T')[0],
    nomorDraft: '', latarBelakang: '', maksud: '', dasarHukum: '',
    analisis: '', rekomendasi: '', selectedRegulations: [], complianceAcknowledged: false,
  });
  renderCurrentStep();
}

function goNext() {
  let valid = true;
  switch (state.step) {
    case 1: valid = validateStep1(); break;
    case 2: valid = validateStep2(); break;
    case 3: valid = validateStep3(); break;
    case 4: valid = validateStep4(); break;
  }
  if (!valid) return;

  if (state.step === 4) {
    state.nomorDraft = generateDraftNumber();
  }

  if (state.step < 5) {
    state.step += 1;
    renderCurrentStep();
    getEl('nasakah-dinas')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function goPrev() {
  if (state.step > 1) {
    // Save current step data
    if (state.step === 2) readStep2();
    if (state.step === 3) readStep3();
    state.step -= 1;
    renderCurrentStep();
  }
}

function renderRegulationLibrary() {
  const lib = getEl('regulationLibrary');
  if (!lib) return;

  const bySource = {
    banksumut: REGULATIONS.filter((r) => r.source === 'banksumut'),
    bi: REGULATIONS.filter((r) => r.source === 'bi'),
    ojk: REGULATIONS.filter((r) => r.source === 'ojk'),
    uu: REGULATIONS.filter((r) => r.source === 'uu'),
  };

  lib.innerHTML = Object.entries(bySource)
    .map(
      ([source, regs]) => `
    <div class="reg-lib-group">
      <h4 class="reg-lib-group__title reg-lib-group__title--${source}">${SOURCE_LABELS[source]} <span>${regs.length}</span></h4>
      <ul class="reg-lib-list">
        ${regs.map((r) => `<li><strong>${r.number}</strong> – ${r.title} <em>(${r.type}, ${r.year})</em></li>`).join('')}
      </ul>
    </div>`
    )
    .join('');
}

export function initNasakahDinas() {
  const section = getEl('nasakah-dinas');
  if (!section) return;

  renderRegulationLibrary();
  renderCurrentStep();

  getEl('nasPrev')?.addEventListener('click', goPrev);
  getEl('nasNext')?.addEventListener('click', goNext);

  // Quick access from service card
  document.querySelectorAll('[data-open-nasakah]').forEach((el) => {
    el.addEventListener('click', (e) => {
      e.preventDefault();
      getEl('nasakah-dinas')?.scrollIntoView({ behavior: 'smooth' });
    });
  });
}

export { REGULATIONS, SOURCE_LABELS, DIVISIONS };
