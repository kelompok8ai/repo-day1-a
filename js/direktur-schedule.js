/**
 * Modul Jadwal Dinas Direktur Bank Sumut
 * 5 Direktur · Reminder · Nama penginput
 */

export const DIRECTORS = [
  { id: 'dir-utama', name: 'Direktur Utama', short: 'DIRUT', color: '#006B3F' },
  { id: 'dir-ops', name: 'Direktur Operasional', short: 'DIROPS', color: '#0284C7' },
  { id: 'dir-bisnis', name: 'Direktur Bisnis & Pemasaran', short: 'DIRBIS', color: '#7C3AED' },
  { id: 'dir-keu', name: 'Direktur Keuangan', short: 'DIRKEU', color: '#C9A227' },
  { id: 'dir-comp', name: 'Direktur Compliance & Hukum', short: 'DIRCOMP', color: '#DC2626' },
];

const STORAGE_KEY = 'banksumut_direktur_schedules';
const REMINDER_OPTIONS = [
  { value: 15, label: '15 menit sebelumnya' },
  { value: 30, label: '30 menit sebelumnya' },
  { value: 60, label: '1 jam sebelumnya' },
  { value: 1440, label: '1 hari sebelumnya' },
];

let schedules = [];
let activeDirector = 'dir-utama';
let reminderInterval = null;
const firedReminders = new Set();

function getEl(id) {
  return document.getElementById(id);
}

function generateId() {
  return `sch-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
}

function getDefaultSchedules() {
  const today = new Date();
  const addDays = (n) => {
    const d = new Date(today);
    d.setDate(d.getDate() + n);
    return d.toISOString().split('T')[0];
  };

  return [
    {
      id: 'default-1',
      directorId: 'dir-utama',
      title: 'Rapat Koordinasi dengan Gubernur Sumatera Utara',
      date: addDays(2),
      timeStart: '09:00',
      timeEnd: '11:00',
      location: 'Kantor Gubernur Sumut, Medan',
      description: 'Pembahasan program pembiayaan UMKM dan kontribusi PAD daerah.',
      inputBy: 'Staf Corporate Secretary',
      reminderMinutes: 60,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'default-2',
      directorId: 'dir-ops',
      title: 'Kunjungan Kerja Kantor Cabang Medan Marelan',
      date: addDays(3),
      timeStart: '10:00',
      timeEnd: '14:00',
      location: 'KC Medan Marelan',
      description: 'Evaluasi kinerja operasional dan layanan nasabah cabang.',
      inputBy: 'Admin Operasional',
      reminderMinutes: 30,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'default-3',
      directorId: 'dir-bisnis',
      title: 'Peluncuran Program KUR UMKM Sumatera Utara',
      date: addDays(5),
      timeStart: '13:00',
      timeEnd: '16:00',
      location: 'Aula Bank Sumut, Medan',
      description: 'Launching produk kredit UMKM dan sosialisasi ke pelaku usaha.',
      inputBy: 'Tim Public Relations',
      reminderMinutes: 60,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'default-4',
      directorId: 'dir-keu',
      title: 'Presentasi Laporan Keuangan ke Dewan Komisaris',
      date: addDays(7),
      timeStart: '08:30',
      timeEnd: '12:00',
      location: 'Ruang Rapat Direksi Lt. 5',
      description: 'Penyampaian laporan keuangan kuartal dan proyeksi kinerja.',
      inputBy: 'Staf Sekretaris Direksi',
      reminderMinutes: 1440,
      createdAt: new Date().toISOString(),
    },
    {
      id: 'default-5',
      directorId: 'dir-comp',
      title: 'Audit Kepatuhan Internal Triwulan II',
      date: addDays(4),
      timeStart: '09:00',
      timeEnd: '15:00',
      location: 'Kantor Pusat Bank Sumut',
      description: 'Review kepatuhan regulasi OJK, BI, dan kebijakan internal.',
      inputBy: 'Divisi Compliance',
      reminderMinutes: 30,
      createdAt: new Date().toISOString(),
    },
  ];
}

function loadSchedules() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      schedules = JSON.parse(saved);
    } else {
      schedules = getDefaultSchedules();
      saveSchedules();
    }
  } catch {
    schedules = getDefaultSchedules();
  }
}

function saveSchedules() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(schedules));
}

function getDirector(id) {
  return DIRECTORS.find((d) => d.id === id);
}

function formatDateID(dateStr) {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const days = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  const d = new Date(dateStr + 'T00:00:00');
  return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
}

function getScheduleDateTime(schedule) {
  return new Date(`${schedule.date}T${schedule.timeStart}:00`);
}

function isUpcoming(schedule) {
  const end = new Date(`${schedule.date}T${schedule.timeEnd || schedule.timeStart}:00`);
  return end >= new Date();
}

function sortSchedules(list) {
  return [...list].sort((a, b) => {
    const da = getScheduleDateTime(a);
    const db = getScheduleDateTime(b);
    return da - db;
  });
}

function renderDirectorTabs() {
  const tabs = getEl('directorTabs');
  if (!tabs) return;

  tabs.innerHTML = DIRECTORS.map(
    (dir) => {
      const count = schedules.filter((s) => s.directorId === dir.id && isUpcoming(s)).length;
      return `
      <button type="button" class="director-tab ${activeDirector === dir.id ? 'active' : ''}"
        data-director="${dir.id}" style="--dir-color: ${dir.color}">
        <span class="director-tab__name">${dir.name}</span>
        <span class="director-tab__count">${count} jadwal</span>
      </button>`;
    }
  ).join('');

  tabs.querySelectorAll('.director-tab').forEach((btn) => {
    btn.addEventListener('click', () => {
      activeDirector = btn.dataset.director;
      renderAll();
    });
  });
}

function renderScheduleList() {
  const list = getEl('scheduleList');
  if (!list) return;

  const dir = getDirector(activeDirector);
  const dirSchedules = sortSchedules(
    schedules.filter((s) => s.directorId === activeDirector)
  );

  if (dirSchedules.length === 0) {
    list.innerHTML = `
      <div class="schedule-empty">
        <span>📅</span>
        <p>Belum ada jadwal dinas untuk <strong>${dir?.name}</strong>.</p>
        <p class="schedule-empty__hint">Tambahkan jadwal baru melalui formulir di samping.</p>
      </div>`;
    return;
  }

  list.innerHTML = dirSchedules
    .map((s) => {
      const upcoming = isUpcoming(s);
      const reminderLabel = REMINDER_OPTIONS.find((r) => r.value === s.reminderMinutes)?.label || `${s.reminderMinutes} menit`;
      return `
      <article class="schedule-card ${upcoming ? '' : 'schedule-card--past'}" data-id="${s.id}">
        <div class="schedule-card__date" style="border-color: ${dir?.color}">
          <span class="schedule-card__day">${new Date(s.date + 'T00:00:00').getDate()}</span>
          <span class="schedule-card__month">${new Date(s.date + 'T00:00:00').toLocaleString('id-ID', { month: 'short' })}</span>
        </div>
        <div class="schedule-card__body">
          <h4 class="schedule-card__title">${s.title}</h4>
          <div class="schedule-card__meta">
            <span>🕐 ${s.timeStart} – ${s.timeEnd} WIB</span>
            <span>📍 ${s.location}</span>
          </div>
          ${s.description ? `<p class="schedule-card__desc">${s.description}</p>` : ''}
          <div class="schedule-card__footer">
            <span class="schedule-card__inputby">👤 Diinput oleh: <strong>${s.inputBy}</strong></span>
            <span class="schedule-card__reminder">🔔 ${reminderLabel}</span>
          </div>
        </div>
        <div class="schedule-card__actions">
          <button type="button" class="schedule-btn schedule-btn--delete" data-delete="${s.id}" aria-label="Hapus jadwal" title="Hapus">✕</button>
        </div>
      </article>`;
    })
    .join('');

  list.querySelectorAll('[data-delete]').forEach((btn) => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.delete;
      if (confirm('Hapus jadwal dinas ini?')) {
        schedules = schedules.filter((s) => s.id !== id);
        saveSchedules();
        renderAll();
      }
    });
  });
}

function renderReminderPanel() {
  const panel = getEl('reminderPanel');
  if (!panel) return;

  const now = new Date();
  const upcoming = sortSchedules(schedules.filter(isUpcoming));

  const nextReminders = upcoming
    .map((s) => {
      const eventTime = getScheduleDateTime(s);
      const remindAt = new Date(eventTime.getTime() - s.reminderMinutes * 60 * 1000);
      const dir = getDirector(s.directorId);
      return { ...s, eventTime, remindAt, dir };
    })
    .filter((s) => s.remindAt > now)
    .slice(0, 5);

  panel.innerHTML = `
    <h4>Reminder Aktif</h4>
    ${
      nextReminders.length === 0
        ? '<p class="reminder-empty">Tidak ada reminder terjadwal.</p>'
        : `<ul class="reminder-list">
        ${nextReminders
          .map(
            (s) => `
          <li class="reminder-item">
            <span class="reminder-item__dot" style="background: ${s.dir?.color}"></span>
            <div>
              <strong>${s.title}</strong>
              <small>${s.dir?.name} · Pengingat: ${s.remindAt.toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</small>
            </div>
          </li>`
          )
          .join('')}
      </ul>`
    }
    <button type="button" class="btn btn--sm btn--outline btn--full" id="enableNotif">
      ${Notification.permission === 'granted' ? '✓ Notifikasi aktif' : 'Aktifkan Notifikasi Browser'}
    </button>`;

  getEl('enableNotif')?.addEventListener('click', requestNotificationPermission);
}

function renderForm() {
  const form = getEl('scheduleForm');
  if (!form) return;

  form.innerHTML = `
    <h3>Tambah Jadwal Dinas</h3>
    <div class="form-group">
      <label for="schDirector">Direktur <span>*</span></label>
      <select id="schDirector" required>
        ${DIRECTORS.map((d) => `<option value="${d.id}" ${d.id === activeDirector ? 'selected' : ''}>${d.name}</option>`).join('')}
      </select>
    </div>
    <div class="form-group">
      <label for="schInputBy">Nama Penginput <span>*</span></label>
      <input type="text" id="schInputBy" required placeholder="Nama lengkap pegawai" />
    </div>
    <div class="form-group">
      <label for="schTitle">Agenda / Kegiatan <span>*</span></label>
      <input type="text" id="schTitle" required placeholder="Contoh: Rapat dengan stakeholder" />
    </div>
    <div class="form-row">
      <div class="form-group">
        <label for="schDate">Tanggal <span>*</span></label>
        <input type="date" id="schDate" required />
      </div>
      <div class="form-group">
        <label for="schReminder">Reminder</label>
        <select id="schReminder">
          ${REMINDER_OPTIONS.map((r) => `<option value="${r.value}">${r.label}</option>`).join('')}
        </select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label for="schTimeStart">Jam Mulai <span>*</span></label>
        <input type="time" id="schTimeStart" required value="09:00" />
      </div>
      <div class="form-group">
        <label for="schTimeEnd">Jam Selesai <span>*</span></label>
        <input type="time" id="schTimeEnd" required value="11:00" />
      </div>
    </div>
    <div class="form-group">
      <label for="schLocation">Lokasi <span>*</span></label>
      <input type="text" id="schLocation" required placeholder="Tempat kegiatan" />
    </div>
    <div class="form-group">
      <label for="schDesc">Keterangan</label>
      <textarea id="schDesc" rows="2" placeholder="Detail tambahan (opsional)"></textarea>
    </div>
    <button type="submit" class="btn btn--primary btn--full">Simpan Jadwal</button>
    <p class="form-note" id="scheduleFormNote" role="status"></p>
  `;

  const dateInput = getEl('schDate');
  if (dateInput) {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    dateInput.min = new Date().toISOString().split('T')[0];
    dateInput.value = tomorrow.toISOString().split('T')[0];
  }

  form.onsubmit = (e) => {
    e.preventDefault();
    const note = getEl('scheduleFormNote');

    const inputBy = getEl('schInputBy')?.value.trim();
    const title = getEl('schTitle')?.value.trim();
    const date = getEl('schDate')?.value;
    const timeStart = getEl('schTimeStart')?.value;
    const timeEnd = getEl('schTimeEnd')?.value;
    const location = getEl('schLocation')?.value.trim();
    const directorId = getEl('schDirector')?.value;

    if (!inputBy || !title || !date || !timeStart || !timeEnd || !location || !directorId) {
      if (note) { note.textContent = 'Mohon lengkapi semua field wajib.'; note.className = 'form-note error'; }
      return;
    }

    if (timeStart >= timeEnd) {
      if (note) { note.textContent = 'Jam selesai harus setelah jam mulai.'; note.className = 'form-note error'; }
      return;
    }

    const newSchedule = {
      id: generateId(),
      directorId,
      title,
      date,
      timeStart,
      timeEnd,
      location,
      description: getEl('schDesc')?.value.trim() || '',
      inputBy,
      reminderMinutes: parseInt(getEl('schReminder')?.value || '30', 10),
      createdAt: new Date().toISOString(),
    };

    schedules.push(newSchedule);
    saveSchedules();
    activeDirector = directorId;

    if (note) {
      note.textContent = `Jadwal berhasil disimpan oleh ${inputBy}.`;
      note.className = 'form-note success';
    }

    renderAll();
    form.reset();
    getEl('schDirector').value = directorId;
    getEl('schTimeStart').value = '09:00';
    getEl('schTimeEnd').value = '11:00';
    if (dateInput) dateInput.value = tomorrow.toISOString().split('T')[0];
  };
}

function showToast(message, type = 'info') {
  let toast = document.querySelector('.schedule-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'schedule-toast';
    document.body.appendChild(toast);
  }
  toast.className = `schedule-toast schedule-toast--${type} schedule-toast--show`;
  toast.innerHTML = message;
  setTimeout(() => toast.classList.remove('schedule-toast--show'), 6000);
}

async function requestNotificationPermission() {
  if (!('Notification' in window)) {
    alert('Browser Anda tidak mendukung notifikasi.');
    return;
  }
  const perm = await Notification.requestPermission();
  renderReminderPanel();
  if (perm === 'granted') showToast('✅ Notifikasi reminder berhasil diaktifkan.', 'success');
}

function checkReminders() {
  const now = new Date();

  schedules.filter(isUpcoming).forEach((s) => {
    const eventTime = getScheduleDateTime(s);
    const remindAt = new Date(eventTime.getTime() - s.reminderMinutes * 60 * 1000);
    const key = `${s.id}-${remindAt.getTime()}`;

    if (now >= remindAt && now < eventTime && !firedReminders.has(key)) {
      firedReminders.add(key);
      const dir = getDirector(s.directorId);
      const msg = `<strong>Reminder Jadwal Dinas</strong><br>${dir?.name}: ${s.title}<br>${formatDateID(s.date)} · ${s.timeStart} WIB · ${s.location}`;

      showToast(msg, 'reminder');

      if (Notification.permission === 'granted') {
        new Notification(`Jadwal Dinas – ${dir?.name}`, {
          body: `${s.title}\n${formatDateID(s.date)} · ${s.timeStart} WIB\n${s.location}\nDiinput: ${s.inputBy}`,
          icon: '/favicon.svg',
          tag: key,
        });
      }
    }
  });
}

function renderAll() {
  renderDirectorTabs();
  renderScheduleList();
  renderReminderPanel();
  renderForm();
}

export function initDirekturSchedule() {
  const section = getEl('jadwal-direktur');
  if (!section) return;

  loadSchedules();
  renderAll();

  if (reminderInterval) clearInterval(reminderInterval);
  checkReminders();
  reminderInterval = setInterval(checkReminders, 30000);

  if ('Notification' in window && Notification.permission === 'default') {
    setTimeout(() => {
      showToast('Aktifkan notifikasi browser untuk menerima reminder jadwal dinas.', 'info');
    }, 2000);
  }
}
