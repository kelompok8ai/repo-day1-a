import { count } from "drizzle-orm";
import type { BetterSQLite3Database } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const now = new Date();
const today = now.toISOString().split("T")[0];

function daysAgo(days: number) {
  const d = new Date(now);
  d.setDate(d.getDate() - days);
  return d.toISOString();
}

function daysFromNow(days: number) {
  const d = new Date(now);
  d.setDate(d.getDate() + days);
  return d.toISOString().split("T")[0];
}

export function seedDatabase(db: BetterSQLite3Database<typeof schema>) {
  const [{ value }] = db.select({ value: count() }).from(schema.users).all();
  if (value > 0) return;

  db.insert(schema.users).values([
    {
      name: "Rina Wulandari",
      email: "rina.wulandari@banksumut.co.id",
      username: "pengusul",
      password: "pengusul123",
      role: "pengusul",
      divisi: "Divisi IT & Digital Banking",
      boardPosition: null,
    },
    {
      name: "Siti Rahayu, SE",
      email: "siti.rahayu@banksumut.co.id",
      username: "corpsec",
      password: "corpsec123",
      role: "corpsec",
      divisi: null,
      boardPosition: null,
    },
    {
      name: "Ir. Hendra Gunawan",
      email: "hendra.gunawan@banksumut.co.id",
      username: "pimpinan",
      password: "pimpinan123",
      role: "pimpinan_bidang",
      divisi: null,
      boardPosition: null,
    },
    {
      name: "Drs. Ahmad Fauzi",
      email: "ahmad.fauzi@banksumut.co.id",
      username: "sekdireksi",
      password: "sekdireksi123",
      role: "sekdireksi",
      divisi: null,
      boardPosition: null,
    },
    {
      name: "Dra. Maya Sari, MM",
      email: "maya.sari@banksumut.co.id",
      username: "sekkom",
      password: "sekkom123",
      role: "sekretaris_komisaris",
      divisi: null,
      boardPosition: null,
    },
    {
      name: "Budi Santoso, SE",
      email: "budi.santoso@banksumut.co.id",
      username: "dirut",
      password: "dirut123",
      role: "direksi",
      divisi: null,
      boardPosition: "direktur_utama",
    },
    {
      name: "Ir. Rudi Hartono",
      email: "rudi.hartono@banksumut.co.id",
      username: "dir_it",
      password: "dirit123",
      role: "direksi",
      divisi: null,
      boardPosition: "direktur_it",
    },
    {
      name: "Drs. Eko Prasetyo, Ak.",
      email: "eko.prasetyo@banksumut.co.id",
      username: "dir_keu",
      password: "dirkeu123",
      role: "direksi",
      divisi: null,
      boardPosition: "direktur_keuangan",
    },
    {
      name: "Dra. Fitriani, SH",
      email: "fitriani@banksumut.co.id",
      username: "dir_kep",
      password: "dirkep123",
      role: "direksi",
      divisi: null,
      boardPosition: "direktur_kepatuhan",
    },
    {
      name: "H. Zulkifli, SE, MM",
      email: "zulkifli@banksumut.co.id",
      username: "dir_bis",
      password: "dirbis123",
      role: "direksi",
      divisi: null,
      boardPosition: "direktur_bisnis",
    },
    {
      name: "Prof. Dr. H. Syamsuddin",
      email: "syamsuddin@banksumut.co.id",
      username: "kom_utama",
      password: "kom123",
      role: "komisaris",
      divisi: null,
      boardPosition: "komisaris_utama",
    },
    {
      name: "Dr. Linda Wijaya, MBA",
      email: "linda.wijaya@banksumut.co.id",
      username: "kom_indep",
      password: "komindep123",
      role: "komisaris",
      divisi: null,
      boardPosition: "komisaris_independen",
    },
    {
      name: "H. Yusuf Rahman",
      email: "yusuf.rahman@banksumut.co.id",
      username: "komisaris",
      password: "komisaris123",
      role: "komisaris",
      divisi: null,
      boardPosition: "komisaris",
    },
  ]).run();

  db.insert(schema.agenda).values([
    {
      title: "Rapat Koordinasi Direksi Bulanan",
      description: "Evaluasi kinerja dan strategi Q2 2026",
      date: today,
      startTime: "09:00",
      endTime: "11:00",
      location: "Ruang Rapat Direksi Lt. 15",
      status: "scheduled",
      priority: "high",
      preparationNotes: "Siapkan laporan kinerja divisi, materi presentasi KPI",
      createdAt: daysAgo(5),
    },
    {
      title: "Pertemuan dengan OJK Regional",
      description: "Pembahasan compliance report triwulan I",
      date: today,
      startTime: "14:00",
      endTime: "16:00",
      location: "Kantor OJK Medan",
      status: "scheduled",
      priority: "high",
      preparationNotes: "Bawa dokumen compliance, laporan NPL, dan LCR",
      createdAt: daysAgo(3),
    },
    {
      title: "Town Hall Meeting Karyawan",
      description: "Sosialisasi transformasi digital Bank Sumut",
      date: daysFromNow(2),
      startTime: "10:00",
      endTime: "12:00",
      location: "Auditorium Bank Sumut",
      status: "scheduled",
      priority: "normal",
      preparationNotes: "Koordinasi dengan HR dan Divisi IT",
      createdAt: daysAgo(7),
    },
    {
      title: "Review Portofolio Kredit Korporasi",
      description: "Analisis eksposur kredit sektor manufaktur",
      date: daysFromNow(4),
      startTime: "13:30",
      endTime: "15:30",
      location: "Ruang Rapat Direksi Lt. 15",
      status: "scheduled",
      priority: "normal",
      preparationNotes: "Data eksposur per sektor dan analisis risiko",
      createdAt: daysAgo(2),
    },
    {
      title: "Kunjungan Kerja Cabang Medan Kota",
      description: "Monitoring operasional dan pelayanan nasabah",
      date: daysFromNow(6),
      startTime: "08:30",
      endTime: "12:00",
      location: "KC Medan Kota",
      status: "scheduled",
      priority: "normal",
      preparationNotes: "Jadwalkan pertemuan dengan manajemen cabang",
      createdAt: daysAgo(1),
    },
  ]).run();

  db.insert(schema.memorandum).values([
    {
      number: "MEM/2026/0142",
      title: "Usulan Perubahan Suku Bunga Deposito",
      content: "Mengusulkan penyesuaian suku bunga deposito berjangka 6 dan 12 bulan sebesar 25 bps mengikuti kebijakan BI 7-Day RR.",
      proposerDivisi: "Divisi Treasury & ALM",
      status: "pending_approval",
      urgency: "high",
      aiSummary: "Memorandum mengusulkan kenaikan suku bunga deposito 25 bps untuk tenor 6-12 bulan. Dampak estimasi: peningkatan dana pihak ketiga Rp 150M dalam 3 bulan. Risiko: margin pressure sebesar 0.15%.",
      aiRiskScore: 35,
      aiComplianceScore: 92,
      aiConfidence: 88,
      submittedAt: daysAgo(2),
      createdAt: daysAgo(3),
    },
    {
      number: "MEM/2026/0138",
      title: "Pengadaan Sistem Core Banking Upgrade",
      content: "Permohonan persetujuan pengadaan upgrade sistem core banking senilai Rp 12,5 miliar untuk meningkatkan kapabilitas digital banking.",
      proposerDivisi: "Divisi IT & Digital Banking",
      status: "pending_approval",
      urgency: "high",
      aiSummary: "Investasi IT senilai Rp 12,5M untuk upgrade core banking. ROI diestimasi 3,2 tahun. Kepatuhan terhadap POJK 12/2024 terpenuhi. Rekomendasi: perlu due diligence vendor.",
      aiRiskScore: 55,
      aiComplianceScore: 87,
      aiConfidence: 82,
      submittedAt: daysAgo(4),
      createdAt: daysAgo(5),
    },
    {
      number: "MEM/2026/0135",
      title: "Restrukturisasi Kredit PT Sumatera Agro",
      content: "Usulan restrukturisasi kredit korporasi senilai Rp 45 miliar dengan perpanjangan tenor 24 bulan.",
      proposerDivisi: "Divisi Bisnis Korporasi",
      status: "ai_review",
      urgency: "normal",
      aiSummary: null,
      aiRiskScore: null,
      aiComplianceScore: null,
      aiConfidence: null,
      submittedAt: daysAgo(1),
      createdAt: daysAgo(2),
    },
    {
      number: "MEM/2026/0129",
      title: "Kebijakan Work From Office 2026",
      content: "Penetapan kebijakan WFO hybrid 3 hari kantor, 2 hari remote untuk seluruh karyawan.",
      proposerDivisi: "Divisi Human Capital",
      status: "approved",
      urgency: "normal",
      aiSummary: "Kebijakan WFO hybrid 3-2. Sesuai dengan SE Direksi No. 15/2025. Tidak ada konflik regulasi.",
      aiRiskScore: 15,
      aiComplianceScore: 98,
      aiConfidence: 95,
      submittedAt: daysAgo(10),
      approvedAt: daysAgo(7),
      signedAt: daysAgo(6),
      createdAt: daysAgo(12),
    },
    {
      number: "MEM/2026/0120",
      title: "Penambahan Cabang Digital Lounge Medan",
      content: "Usulan pembukaan cabang digital lounge di Medan Fair Plaza.",
      proposerDivisi: "Divisi Jaringan & Channel",
      status: "rejected",
      urgency: "normal",
      aiSummary: "Investasi Rp 3,2M dengan proyeksi break-even 4,5 tahun. Risiko lokasi: overlap dengan KC Medan Kota (jarak 1,2 km).",
      aiRiskScore: 72,
      aiComplianceScore: 90,
      aiConfidence: 79,
      submittedAt: daysAgo(20),
      createdAt: daysAgo(22),
    },
    {
      number: "MEM/2026/0145",
      title: "Penyesuaian Limit Transaksi Digital Banking",
      content: "Kenaikan limit transaksi harian mobile banking dari Rp 50 juta menjadi Rp 100 juta.",
      proposerDivisi: "Divisi IT & Digital Banking",
      status: "pending_approval",
      urgency: "high",
      aiSummary: "Kenaikan limit transaksi 100%. Perlu penyesuaian sistem fraud detection. Sesuai POJK 11/2022 tentang TI.",
      aiRiskScore: 48,
      aiComplianceScore: 91,
      aiConfidence: 86,
      submittedAt: daysAgo(0),
      createdAt: daysAgo(1),
    },
  ]).run();

  db.insert(schema.mediaArticles).values([
    {
      title: "Bank Sumut Catat Pertumbuhan Kredit 12,3% di Q1 2026",
      source: "Bisnis Indonesia",
      summary: "Bank Sumut mencatat pertumbuhan kredit positif sebesar 12,3% YoY pada kuartal pertama 2026, didorong sektor UMKM dan korporasi.",
      category: "Bank Sumut",
      sentiment: "positive",
      publishedAt: daysAgo(0),
    },
    {
      title: "OJK Perketat Regulasi Digital Banking",
      source: "Kontan",
      summary: "OJK menerbitkan POJK baru terkait tata kelola digital banking yang wajib diimplementasikan seluruh bank umum per Q3 2026.",
      category: "Regulasi",
      sentiment: "neutral",
      publishedAt: daysAgo(1),
    },
    {
      title: "Bank Sumut Luncurkan Program Green Banking",
      source: "Medan Bisnis",
      summary: "Inisiatif green banking Bank Sumut targetkan pembiayaan ramah lingkungan Rp 500 miliar tahun 2026.",
      category: "Bank Sumut",
      sentiment: "positive",
      publishedAt: daysAgo(2),
    },
    {
      title: "BI Pertahankan Suku Bunga Acuan di 5,75%",
      source: "Reuters Indonesia",
      summary: "Bank Indonesia mempertahankan BI 7-Day Reverse Repo Rate di 5,75% pada rapat bulan Mei 2026.",
      category: "Makroekonomi",
      sentiment: "neutral",
      publishedAt: daysAgo(1),
    },
    {
      title: "Analisis: Persaingan Perbankan di Sumatera Utara Semakin Ketat",
      source: "Tempo",
      summary: "Masuknya bank digital dan ekspansi bank BUMN menambah persaingan di pasar Sumatera Utara.",
      category: "Industri Perbankan",
      sentiment: "negative",
      publishedAt: daysAgo(3),
    },
  ]).run();

  db.insert(schema.meetings).values([
    {
      title: "Rapat Direksi Bulanan - Mei 2026",
      date: daysFromNow(-7),
      startTime: "09:00",
      endTime: "12:00",
      location: "Ruang Rapat Direksi",
      agenda: "Review KPI, NPL, LCR, dan strategi digital",
      minutes: "Disepakati target NPL maksimal 3,5%. Acceleration digital banking Q3.",
      status: "completed",
      createdAt: daysAgo(10),
    },
    {
      title: "Rapat Komite Audit",
      date: daysFromNow(3),
      startTime: "10:00",
      endTime: "12:00",
      location: "Ruang Komite Audit",
      agenda: "Review laporan audit internal Q1, follow-up temuan",
      minutes: null,
      status: "scheduled",
      createdAt: daysAgo(5),
    },
  ]).run();

  db.insert(schema.meetingFollowups).values([
    {
      meetingId: 1,
      description: "Susun action plan penurunan NPL sektor properti",
      assignee: "Divisi Bisnis Korporasi",
      dueDate: daysFromNow(14),
      status: "open",
    },
    {
      meetingId: 1,
      description: "Laporan progress digital onboarding nasabah",
      assignee: "Divisi IT & Digital Banking",
      dueDate: daysFromNow(7),
      status: "in_progress",
    },
    {
      meetingId: 1,
      description: "Review kebijakan AML/CFT terbaru",
      assignee: "Divisi Compliance",
      dueDate: daysFromNow(21),
      status: "open",
    },
  ]).run();

  db.insert(schema.knowledgeDocuments).values([
    {
      title: "SK Direksi No. 12/2025 - Kebijakan Manajemen Risiko",
      category: "internal",
      type: "SK Bank Sumut",
      content: "Kebijakan manajemen risiko terintegrasi sesuai POJK 18/2023.",
      updatedAt: daysAgo(30),
    },
    {
      title: "SE Direksi No. 08/2026 - Pedoman Digital Banking",
      category: "internal",
      type: "SE Bank Sumut",
      content: "Standar operasional digital banking dan keamanan siber.",
      updatedAt: daysAgo(15),
    },
    {
      title: "POJK No. 12/2024 - Penyelenggaraan TI Bank",
      category: "external",
      type: "Regulasi OJK",
      content: "Ketentuan tata kelola teknologi informasi perbankan.",
      updatedAt: daysAgo(60),
    },
    {
      title: "POJK No. 18/2023 - Manajemen Risiko Bank",
      category: "external",
      type: "Regulasi OJK",
      content: "Penerapan manajemen risiko terintegrasi.",
      updatedAt: daysAgo(90),
    },
    {
      title: "SOP Corporate Secretary - Pengelolaan Memorandum",
      category: "internal",
      type: "SOP",
      content: "Prosedur standar pengelolaan memorandum Direksi.",
      updatedAt: daysAgo(10),
    },
  ]).run();

  db.insert(schema.regulatoryNotifications).values([
    {
      title: "Deadline Laporan Compliance Q1 2026",
      regulator: "OJK",
      description: "Batas akhir pelaporan compliance report triwulan I adalah 15 Juli 2026.",
      severity: "warning",
      createdAt: daysAgo(2),
      isRead: false,
    },
    {
      title: "Pembaruan POJK Digital Banking",
      regulator: "OJK",
      description: "POJK baru tentang tata kelola digital banking wajib diimplementasikan per September 2026.",
      severity: "critical",
      createdAt: daysAgo(1),
      isRead: false,
    },
    {
      title: "Survey Stabilitas Sistem Perbankan",
      regulator: "BI",
      description: "BI mengundang partisipasi dalam survey stabilitas sistem perbankan Q2 2026.",
      severity: "info",
      createdAt: daysAgo(5),
      isRead: true,
    },
  ]).run();

  db.insert(schema.slaRecords).values([
    { memorandumId: 1, targetHours: 72, actualHours: 48, status: "on_track", createdAt: daysAgo(3) },
    { memorandumId: 2, targetHours: 72, actualHours: 96, status: "breached", createdAt: daysAgo(5) },
    { memorandumId: 3, targetHours: 48, actualHours: 24, status: "on_track", createdAt: daysAgo(2) },
    { memorandumId: 4, targetHours: 72, actualHours: 60, status: "on_track", createdAt: daysAgo(12) },
    { memorandumId: 5, targetHours: 72, actualHours: 84, status: "breached", createdAt: daysAgo(22) },
    { memorandumId: 6, targetHours: 48, actualHours: 12, status: "on_track", createdAt: daysAgo(1) },
  ]).run();
}
