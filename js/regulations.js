/**
 * Database Regulasi Terintegrasi
 * Bank Sumut (SK/SE) · BI · OJK · Peraturan Perundang-undangan RI
 */

export const DIVISIONS = [
  { id: 'direksi', name: 'Direksi', code: 'DIR' },
  { id: 'corsec', name: 'Corporate Secretary', code: 'CORSEC' },
  { id: 'compliance', name: 'Compliance & Legal', code: 'COMP' },
  { id: 'audit', name: 'Internal Audit', code: 'IA' },
  { id: 'risk', name: 'Risk Management', code: 'RM' },
  { id: 'treasury', name: 'Treasury & International Banking', code: 'TIB' },
  { id: 'commercial', name: 'Commercial Banking', code: 'CB' },
  { id: 'retail', name: 'Retail Banking & Digital', code: 'RBD' },
  { id: 'msme', name: 'Micro, Small & Medium Enterprise', code: 'MSME' },
  { id: 'hc', name: 'Human Capital', code: 'HC' },
  { id: 'finance', name: 'Finance & Accounting', code: 'FA' },
  { id: 'it', name: 'IT & Digital Transformation', code: 'IT' },
  { id: 'ops', name: 'Operations', code: 'OPS' },
  { id: 'pr', name: 'Public Relations', code: 'PR' },
  { id: 'credit', name: 'Credit & Collection', code: 'CR' },
  { id: 'sharia', name: 'Sharia Banking', code: 'SYR' },
  { id: 'branch', name: 'Jaringan Kantor Cabang', code: 'KC' },
  { id: 'gcg', name: 'Good Corporate Governance', code: 'GCG' },
];

export const DOC_TYPES = [
  { id: 'resume-memo', name: 'Resume Memo Nasakah Dinas', desc: 'Ringkasan memo untuk persetujuan atau tindak lanjut' },
  { id: 'nota-dinas', name: 'Nota Dinas', desc: 'Surat internal antar unit kerja' },
  { id: 'surat-edaran', name: 'Surat Edaran Internal', desc: 'Penyampaian kebijakan/prosedur internal' },
  { id: 'instruksi-kerja', name: 'Instruksi Kerja', desc: 'Petunjuk pelaksanaan tugas operasional' },
  { id: 'laporan-internal', name: 'Laporan Internal', desc: 'Laporan kinerja atau temuan internal' },
];

export const CLASSIFICATIONS = [
  { id: 'rahasia', name: 'Rahasia', level: 3 },
  { id: 'terbatas', name: 'Terbatas', level: 2 },
  { id: 'internal', name: 'Internal', level: 1 },
  { id: 'umum', name: 'Umum', level: 0 },
];

export const TOPICS = [
  { id: 'tata-kelola', name: 'Tata Kelola & GCG', tags: ['gcg', 'corporate', 'direksi', 'audit'] },
  { id: 'kepatuhan', name: 'Kepatuhan & Compliance', tags: ['compliance', 'aml', 'audit', 'legal'] },
  { id: 'kredit', name: 'Kredit & Pembiayaan', tags: ['kredit', 'lending', 'kolektibilitas', 'agunan'] },
  { id: 'operasional', name: 'Operasional Perbankan', tags: ['operasional', 'prosedur', 'layanan'] },
  { id: 'digital', name: 'Digital Banking & IT', tags: ['digital', 'it', 'siber', 'payment'] },
  { id: 'sdm', name: 'SDM & Organisasi', tags: ['sdm', 'hc', 'organisasi', 'disiplin'] },
  { id: 'keuangan', name: 'Keuangan & Akuntansi', tags: ['keuangan', 'laporan', 'akuntansi', 'modal'] },
  { id: 'risiko', name: 'Manajemen Risiko', tags: ['risiko', 'erm', 'kredit', 'operasional'] },
  { id: 'syariah', name: 'Perbankan Syariah', tags: ['syariah', 'dps', 'akad'] },
  { id: 'humas', name: 'Komunikasi & Humas', tags: ['humas', 'media', 'publik', 'csr'] },
  { id: 'hukum', name: 'Hukum & Peraturan', tags: ['hukum', 'legal', 'peraturan', 'uu'] },
  { id: 'csr', name: 'CSR & Tanggung Jawab Sosial', tags: ['csr', 'sosial', 'lingkungan'] },
];

export const REGULATIONS = [
  /* ── Bank Sumut – Surat Keputusan (SK) ── */
  {
    id: 'sk-bs-001',
    source: 'banksumut',
    type: 'SK',
    number: 'SK.001/DIR-BSUM/2024',
    title: 'Pedoman Tata Naskah Dinas Bank Sumut',
    year: 2024,
    tags: ['naskah', 'tata-naskah', 'prosedur', 'operasional', 'humas'],
    summary: 'Ketentuan format, klasifikasi, alur persetujuan, dan pengarsipan naskah dinas internal Bank Sumut.',
    articles: ['Pasal 5: Format naskah dinas', 'Pasal 8: Klasifikasi dokumen', 'Pasal 12: Alur persetujuan'],
  },
  {
    id: 'sk-bs-002',
    source: 'banksumut',
    type: 'SK',
    number: 'SK.045/DIR-BSUM/2023',
    title: 'Kebijakan Good Corporate Governance Bank Sumut',
    year: 2023,
    tags: ['gcg', 'tata-kelola', 'direksi', 'komisaris', 'audit'],
    summary: 'Implementasi prinsip transparansi, akuntabilitas, responsibilitas, independensi, dan fairness.',
    articles: ['Pasal 3: Prinsip GCG', 'Pasal 7: Komite pendukung', 'Pasal 15: Pelaporan GCG'],
  },
  {
    id: 'sk-bs-003',
    source: 'banksumut',
    type: 'SK',
    number: 'SK.112/DIR-BSUM/2024',
    title: 'Kebijakan Manajemen Risiko Terintegrasi',
    year: 2024,
    tags: ['risiko', 'erm', 'kredit', 'operasional', 'likuiditas'],
    summary: 'Kerangka ERM Bank Sumut meliputi risiko kredit, pasar, likuiditas, operasional, dan kepatuhan.',
    articles: ['Pasal 4: Profil risiko', 'Pasal 9: Risk appetite', 'Pasal 14: Pelaporan risiko'],
  },
  {
    id: 'sk-bs-004',
    source: 'banksumut',
    type: 'SK',
    number: 'SK.078/DIR-BSUM/2023',
    title: 'Kebijakan Anti Pencucian Uang dan Pencegahan Pendanaan Terorisme',
    year: 2023,
    tags: ['aml', 'kepatuhan', 'cdd', 'edd', 'ppatk'],
    summary: 'Prosedur identifikasi nasabah, monitoring transaksi, dan pelaporan STR/CTR sesuai ketentuan PPATK.',
    articles: ['Pasal 6: CDD/EDD', 'Pasal 11: Monitoring transaksi', 'Pasal 18: Pelaporan STR'],
  },
  {
    id: 'sk-bs-005',
    source: 'banksumut',
    type: 'SK',
    number: 'SK.156/DIR-BSUM/2024',
    title: 'Standar Operasional Prosedur Pemberian Kredit',
    year: 2024,
    tags: ['kredit', 'lending', 'agunan', 'analisis', 'kolektibilitas'],
    summary: 'Tahapan analisis kredit, persyaratan agunan, persetujuan, dan monitoring kredit Bank Sumut.',
    articles: ['Pasal 5: Analisis 5C', 'Pasal 10: Persetujuan kredit', 'Pasal 16: Restrukturisasi'],
  },

  /* ── Bank Sumut – Surat Edaran (SE) ── */
  {
    id: 'se-bs-001',
    source: 'banksumut',
    type: 'SE',
    number: 'SE.024/CORSEC/2025',
    title: 'Petunjuk Penyusunan Resume Memo Nasakah Dinas',
    year: 2025,
    tags: ['naskah', 'resume-memo', 'corsec', 'prosedur'],
    summary: 'Format resume memo nasakah dinas untuk seluruh divisi, termasuk struktur latar belakang, analisis, dan rekomendasi.',
    articles: ['Lampiran I: Template resume memo', 'Lampiran II: Checklist kepatuhan'],
  },
  {
    id: 'se-bs-002',
    source: 'banksumut',
    type: 'SE',
    number: 'SE.018/COMP/2024',
    title: 'Implementasi POJK terkait Kepatuhan Perbankan',
    year: 2024,
    tags: ['kepatuhan', 'compliance', 'pojk', 'legal'],
    summary: 'Pemetaan dan implementasi POJK wajib di Bank Sumut beserta timeline compliance.',
    articles: ['Lampiran A: Daftar POJK wajib', 'Lampiran B: PIC per divisi'],
  },
  {
    id: 'se-bs-003',
    source: 'banksumut',
    type: 'SE',
    number: 'SE.033/IT/2025',
    title: 'Keamanan Informasi dan Tata Kelola Data Digital',
    year: 2025,
    tags: ['digital', 'it', 'siber', 'data', 'keamanan'],
    summary: 'Standar keamanan siber, enkripsi data, dan prosedur insiden keamanan informasi.',
    articles: ['Pasal 4: Klasifikasi data', 'Pasal 8: Incident response', 'Pasal 12: Akses data'],
  },
  {
    id: 'se-bs-004',
    source: 'banksumut',
    type: 'SE',
    number: 'SE.009/HC/2024',
    title: 'Kode Etik dan Pedoman Perilaku Pegawai',
    year: 2024,
    tags: ['sdm', 'hc', 'etika', 'disiplin', 'organisasi'],
    summary: 'Standar etika, integritas, dan perilaku pegawai Bank Sumut.',
    articles: ['Bab III: Integritas', 'Bab V: Konflik kepentingan', 'Bab VII: Sanksi'],
  },
  {
    id: 'se-bs-005',
    source: 'banksumut',
    type: 'SE',
    number: 'SE.041/PR/2025',
    title: 'Prosedur Komunikasi Publik dan Media Relations',
    year: 2025,
    tags: ['humas', 'media', 'publik', 'crisis', 'pr'],
    summary: 'Prosedur konferensi pers, press release, dan crisis communication.',
    articles: ['Pasal 3: Otorisasi publikasi', 'Pasal 7: Crisis comm', 'Pasal 10: Media monitoring'],
  },

  /* ── Bank Indonesia (BI) ── */
  {
    id: 'bi-pbi-23-6',
    source: 'bi',
    type: 'PBI',
    number: 'PBI No. 23/6/PBI/2021',
    title: 'Penyelenggaraan Sistem Pembayaran',
    year: 2021,
    tags: ['digital', 'payment', 'operasional', 'it'],
    summary: 'Ketentuan penyelenggaraan sistem pembayaran termasuk payment system provider dan infrastruktur.',
    articles: ['Pasal 15: Infrastruktur SP', 'Pasal 22: Provider SP', 'Pasal 30: Keamanan SP'],
  },
  {
    id: 'bi-pbi-22-23',
    source: 'bi',
    type: 'PBI',
    number: 'PBI No. 22/23/PBI/2020',
    title: 'Layanan Informasi Keuangan Digital',
    year: 2020,
    tags: ['digital', 'it', 'open-banking', 'data'],
    summary: 'Kerangka layanan informasi keuangan digital (LJK digital) dan API terbuka.',
    articles: ['Pasal 4: Ruang lingkup LJK digital', 'Pasal 12: Keamanan data'],
  },
  {
    id: 'bi-padg-23-9',
    source: 'bi',
    type: 'PADG',
    number: 'PADG No. 23/9/PADG/2021',
    title: 'Penyedia Jasa Pembayaran',
    year: 2021,
    tags: ['digital', 'payment', 'operasional'],
    summary: 'Perizinan dan tata laksana penyedia jasa pembayaran.',
    articles: ['Pasal 5: Perizinan PJP', 'Pasal 18: Kewajiban PJP'],
  },
  {
    id: 'bi-se-22-6',
    source: 'bi',
    type: 'SE BI',
    number: 'SE No. 22/6/DKSP',
    title: 'Penerapan Manajemen Risiko dalam Penggunaan Teknologi Informasi',
    year: 2020,
    tags: ['risiko', 'it', 'digital', 'siber'],
    summary: 'Panduan manajemen risiko TI untuk bank umum.',
    articles: ['Poin 3: Risk assessment TI', 'Poin 7: Business continuity'],
  },
  {
    id: 'bi-pbi-11-28',
    source: 'bi',
    type: 'PBI',
    number: 'PBI No. 11/28/PBI/2009',
    title: 'Bank Umum (sebagaimana diubah terakhir)',
    year: 2009,
    tags: ['operasional', 'keuangan', 'kredit', 'hukum'],
    summary: 'Ketentuan pokok penyelenggaraan kegiatan bank umum di Indonesia.',
    articles: ['Pasal 29: Kegiatan usaha', 'Pasal 52: Modal minimum', 'Pasal 71: BMPK'],
  },

  /* ── OJK ── */
  {
    id: 'pojk-40-2024',
    source: 'ojk',
    type: 'POJK',
    number: 'POJK No. 40 Tahun 2024',
    title: 'Tata Kelola Perusahaan yang Baik bagi Lembaga Keuangan',
    year: 2024,
    tags: ['gcg', 'tata-kelola', 'direksi', 'komisaris'],
    summary: 'Ketentuan GCG wajib bagi lembaga keuangan termasuk bank.',
    articles: ['Pasal 5: Prinsip GCG', 'Pasal 12: Komite audit', 'Pasal 20: Self assessment GCG'],
  },
  {
    id: 'pojk-18-2025',
    source: 'ojk',
    type: 'POJK',
    number: 'POJK No. 18 Tahun 2025',
    title: 'Penyelenggaraan Layanan Digital Bank Umum',
    year: 2025,
    tags: ['digital', 'it', 'operasional', 'keamanan'],
    summary: 'Ketentuan layanan perbankan digital, autentikasi, dan perlindungan nasabah.',
    articles: ['Pasal 8: Autentikasi', 'Pasal 15: Edukasi nasabah', 'Pasal 22: Pengaduan'],
  },
  {
    id: 'pojk-11-2024',
    source: 'ojk',
    type: 'POJK',
    number: 'POJK No. 11 Tahun 2024',
    title: 'Penerapan Anti Pencucian Uang dan Pencegahan Pendanaan Terorisme',
    year: 2024,
    tags: ['aml', 'kepatuhan', 'cdd', 'ppatk'],
    summary: 'Kewajiban LJK dalam APUPPT termasuk CDD, monitoring, dan pelaporan.',
    articles: ['Pasal 10: CDD', 'Pasal 18: STR', 'Pasal 25: Sanksi'],
  },
  {
    id: 'pojk-6-2022',
    source: 'ojk',
    type: 'POJK',
    number: 'POJK No. 6 Tahun 2022',
    title: 'Penyelenggaraan Perbankan Syariah',
    year: 2022,
    tags: ['syariah', 'dps', 'akad', 'kredit'],
    summary: 'Ketentuan produk dan operasional perbankan syariah.',
    articles: ['Pasal 5: Prinsip syariah', 'Pasal 14: Akad pembiayaan', 'Pasal 22: DPS'],
  },
  {
    id: 'pojk-39-2023',
    source: 'ojk',
    type: 'POJK',
    number: 'POJK No. 39 Tahun 2023',
    title: 'Manajemen Risiko Lembaga Jasa Keuangan',
    year: 2023,
    tags: ['risiko', 'erm', 'kepatuhan'],
    summary: 'Kerangka manajemen risiko terintegrasi untuk LJK.',
    articles: ['Pasal 6: Profil risiko', 'Pasal 14: Stress testing', 'Pasal 20: Pelaporan'],
  },
  {
    id: 'pojk-22-2023',
    source: 'ojk',
    type: 'POJK',
    number: 'POJK No. 22 Tahun 2023',
    title: 'Penyelenggaraan Kegiatan Perbankan',
    year: 2023,
    tags: ['operasional', 'kredit', 'keuangan'],
    summary: 'Ketentuan kegiatan perbankan termasuk kredit, deposito, dan treasury.',
    articles: ['Pasal 8: Pemberian kredit', 'Pasal 20: Restrukturisasi', 'Pasal 35: Likuiditas'],
  },
  {
    id: 'seo-35-2024',
    source: 'ojk',
    type: 'SEOJK',
    number: 'SEOJK No. 35/SEOJK.03/2024',
    title: 'Penerapan Manajemen Risiko Teknologi Informasi',
    year: 2024,
    tags: ['it', 'digital', 'risiko', 'siber'],
    summary: 'Pedoman manajemen risiko TI dan keamanan siber untuk bank.',
    articles: ['Poin II: Governance TI', 'Poin V: Cyber security', 'Poin VIII: DR/BCP'],
  },

  /* ── Peraturan Perundang-undangan RI ── */
  {
    id: 'uu-7-1992',
    source: 'uu',
    type: 'UU',
    number: 'UU No. 7 Tahun 1992',
    title: 'Perbankan (sebagaimana diubah UU No. 10 Tahun 1998)',
    year: 1992,
    tags: ['hukum', 'operasional', 'kredit', 'keuangan'],
    summary: 'Undang-undang dasar perbankan di Indonesia.',
    articles: ['Pasal 7: Kegiatan usaha bank', 'Pasal 29: Kewajiban bank', 'Pasal 47: Pengawasan'],
  },
  {
    id: 'uu-21-2011',
    source: 'uu',
    type: 'UU',
    number: 'UU No. 21 Tahun 2011',
    title: 'Otoritas Jasa Keuangan',
    year: 2011,
    tags: ['hukum', 'ojk', 'kepatuhan', 'pengawasan'],
    summary: 'Pembentukan dan kewenangan OJK dalam mengawasi sektor jasa keuangan.',
    articles: ['Pasal 4: Tugas OJK', 'Pasal 35: Pengawasan', 'Pasal 52: Sanksi'],
  },
  {
    id: 'uu-8-2010',
    source: 'uu',
    type: 'UU',
    number: 'UU No. 8 Tahun 2010',
    title: 'Pencegahan dan Pemberantasan Tindak Pidana Pencucian Uang',
    year: 2010,
    tags: ['aml', 'hukum', 'kepatuhan', 'ppatk'],
    summary: 'Kerangka hukum APUPPT di Indonesia.',
    articles: ['Pasal 3: Pencegahan', 'Pasal 14: Pelaporan', 'Pasal 22: Sanksi pidana'],
  },
  {
    id: 'uu-27-2022',
    source: 'uu',
    type: 'UU',
    number: 'UU No. 27 Tahun 2022',
    title: 'Pelindungan Data Pribadi',
    year: 2022,
    tags: ['hukum', 'data', 'digital', 'it', 'keamanan'],
    summary: 'Pelindungan data pribadi termasuk data nasabah perbankan.',
    articles: ['Pasal 4: Prinsip PDP', 'Pasal 20: Hak subjek data', 'Pasal 57: Sanksi'],
  },
  {
    id: 'pp-29-2024',
    source: 'uu',
    type: 'PP',
    number: 'PP No. 29 Tahun 2024',
    title: 'Penyelenggaraan Sektor Keuangan',
    year: 2024,
    tags: ['hukum', 'operasional', 'kepatuhan'],
    summary: 'Peraturan pelaksana sektor keuangan pasca UU OJK.',
    articles: ['Pasal 5: Perizinan', 'Pasal 12: Pengawasan', 'Pasal 18: Sanksi administratif'],
  },
  {
    id: 'uu-11-2008',
    source: 'uu',
    type: 'UU',
    number: 'UU No. 11 Tahun 2008',
    title: 'Informasi dan Transaksi Elektronik (ITE)',
    year: 2008,
    tags: ['hukum', 'digital', 'it', 'siber'],
    summary: 'Ketentuan informasi dan transaksi elektronik termasuk tanda tangan digital.',
    articles: ['Pasal 5: Validitas dok elektronik', 'Pasal 11: TTE', 'Pasal 27: Penyalahgunaan'],
  },
];

export const SOURCE_LABELS = {
  banksumut: 'Bank Sumut',
  bi: 'Bank Indonesia',
  ojk: 'OJK',
  uu: 'Perundang-undangan RI',
};

export const COMPLIANCE_RULES = [
  {
    id: 'rule-naskah-format',
    label: 'Format naskah dinas sesuai SK.001/DIR-BSUM/2024',
    regulationId: 'sk-bs-001',
    check: (data) => data.perihal?.length >= 10 && data.latarBelakang?.length >= 50,
    message: 'Perihal minimal 10 karakter dan latar belakang minimal 50 karakter.',
  },
  {
    id: 'rule-resume-structure',
    label: 'Struktur resume memo lengkap (latar belakang, maksud, analisis, rekomendasi)',
    regulationId: 'se-bs-001',
    check: (data) => data.latarBelakang && data.maksud && data.analisis && data.rekomendasi,
    message: 'Semua bagian resume memo wajib diisi.',
  },
  {
    id: 'rule-klasifikasi',
    label: 'Klasifikasi dokumen telah ditetapkan',
    regulationId: 'sk-bs-001',
    check: (data) => !!data.klasifikasi,
    message: 'Pilih klasifikasi dokumen (Rahasia/Terbatas/Internal/Umum).',
  },
  {
    id: 'rule-dasar-hukum',
    label: 'Dasar hukum/regulasi minimal 1 referensi',
    regulationId: 'se-bs-002',
    check: (data) => data.selectedRegulations?.length >= 1,
    message: 'Lampirkan minimal 1 referensi regulasi terkait.',
  },
  {
    id: 'rule-gcg-topic',
    label: 'Topik GCG wajib rujuk POJK 40/2024',
    regulationId: 'pojk-40-2024',
    check: (data) => data.topic !== 'tata-kelola' || data.selectedRegulations?.includes('pojk-40-2024'),
    message: 'Topik tata kelola wajib merujuk POJK No. 40 Tahun 2024.',
  },
  {
    id: 'rule-aml-topic',
    label: 'Topik kepatuhan AML wajib rujuk POJK 11/2024 dan SK AML Bank Sumut',
    regulationId: 'pojk-11-2024',
    check: (data) =>
      data.topic !== 'kepatuhan' ||
      (data.selectedRegulations?.includes('pojk-11-2024') && data.selectedRegulations?.includes('sk-bs-004')),
    message: 'Topik kepatuhan AML wajib merujuk POJK 11/2024 dan SK.078/DIR-BSUM/2023.',
  },
  {
    id: 'rule-kredit-topic',
    label: 'Topik kredit wajib rujuk SK SOP Kredit Bank Sumut',
    regulationId: 'sk-bs-005',
    check: (data) => data.topic !== 'kredit' || data.selectedRegulations?.includes('sk-bs-005'),
    message: 'Topik kredit wajib merujuk SK.156/DIR-BSUM/2024.',
  },
  {
    id: 'rule-digital-topic',
    label: 'Topik digital banking wajib rujuk POJK 18/2025',
    regulationId: 'pojk-18-2025',
    check: (data) => data.topic !== 'digital' || data.selectedRegulations?.includes('pojk-18-2025'),
    message: 'Topik digital banking wajib merujuk POJK No. 18 Tahun 2025.',
  },
  {
    id: 'rule-pdp-digital',
    label: 'Dokumen terkait data pribadi wajib rujuk UU PDP',
    regulationId: 'uu-27-2022',
    check: (data) =>
      data.topic !== 'digital' ||
      !data.analisis?.toLowerCase().includes('data pribadi') ||
      data.selectedRegulations?.includes('uu-27-2022'),
    message: 'Dokumen yang membahas data pribadi wajib merujuk UU No. 27 Tahun 2022.',
  },
  {
    id: 'rule-divisi',
    label: 'Unit kerja/divisi pengirim telah diidentifikasi',
    regulationId: 'sk-bs-001',
    check: (data) => !!data.division,
    message: 'Pilih divisi/unit kerja pengirim.',
  },
];

/** Rekomendasi regulasi berdasarkan topik & divisi */
export function suggestRegulations(topicId, divisionId, docType) {
  const topic = TOPICS.find((t) => t.id === topicId);
  const topicTags = topic?.tags || [];

  const mandatory = new Set();

  // Wajib untuk semua resume memo nasakah dinas
  if (docType === 'resume-memo' || docType === 'nota-dinas') {
    mandatory.add('sk-bs-001');
    mandatory.add('se-bs-001');
  }

  // Berdasarkan topik
  REGULATIONS.forEach((reg) => {
    const match = reg.tags.some((tag) => topicTags.includes(tag));
    if (match) mandatory.add(reg.id);
  });

  // Berdasarkan divisi
  const divisionTopicMap = {
    compliance: ['kepatuhan', 'hukum'],
    audit: ['tata-kelola', 'kepatuhan'],
    risk: ['risiko', 'kredit'],
    it: ['digital', 'kepatuhan'],
    sharia: ['syariah', 'kepatuhan'],
    pr: ['humas', 'csr'],
    gcg: ['tata-kelola', 'kepatuhan'],
    credit: ['kredit', 'risiko'],
  };

  const divTopics = divisionTopicMap[divisionId] || [];
  divTopics.forEach((tid) => {
    const t = TOPICS.find((x) => x.id === tid);
    if (t) {
      REGULATIONS.forEach((reg) => {
        if (reg.tags.some((tag) => t.tags.includes(tag))) mandatory.add(reg.id);
      });
    }
  });

  return [...mandatory].map((id) => REGULATIONS.find((r) => r.id === id)).filter(Boolean);
}

export function getRegulationById(id) {
  return REGULATIONS.find((r) => r.id === id);
}

export function filterRegulations(query, source) {
  const q = query.toLowerCase();
  return REGULATIONS.filter((r) => {
    const matchSource = !source || source === 'all' || r.source === source;
    const matchQuery =
      !q ||
      r.title.toLowerCase().includes(q) ||
      r.number.toLowerCase().includes(q) ||
      r.summary.toLowerCase().includes(q) ||
      r.tags.some((t) => t.includes(q));
    return matchSource && matchQuery;
  });
}

export function validateCompliance(data) {
  return COMPLIANCE_RULES.map((rule) => ({
    ...rule,
    passed: rule.check(data),
    regulation: getRegulationById(rule.regulationId),
  }));
}
