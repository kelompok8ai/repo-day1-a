# CorpSec Bank Sumut

Aplikasi **Corporate Secretary Bank Sumut** berbasis Next.js dan SQLite, mengimplementasikan PRD discovery v0.1 untuk digitalisasi agenda Direksi, memorandum, media monitoring, rapat, SLA, dan dashboard dengan grafik.

## Fitur

- **Dashboard Direksi** — agenda hari ini/minggu ini, memorandum pending, notifikasi regulator, grafik statistik
- **Manajemen Agenda** — CRUD jadwal kegiatan Direksi
- **Manajemen Memorandum** — upload scan/file, analisa AI (SMD + regulasi), edit review, workflow CorpSec → Pimpinan Bidang
- **Menu Pimpinan Bidang** — approve + tanda tangan digital, tolak + komentar revisi
- **Indikator baca** — titik merah (belum dibaca) / hijau (sudah dibaca)
- **Meeting Management** — rapat dan tindak lanjut
- **Media Monitoring** — berita Bank Sumut, regulasi, industri perbankan
- **Knowledge Base** — dokumen internal (SK, SE, SOP) dan regulasi eksternal (OJK, BI)
- **SLA Monitoring** — pemantauan SLA memorandum dengan grafik tren
- **Reporting** — laporan statistik dan KPI success metrics

## Tech Stack

- Next.js 16 (App Router)
- SQLite + Drizzle ORM
- Tailwind CSS v4
- Recharts (grafik)
- TypeScript

## Menjalankan

```bash
npm install
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) — database SQLite otomatis dibuat dan di-seed saat pertama kali diakses.

```bash
npm run build   # Production build
npm run start   # Production server
npm run lint    # ESLint
```

## Struktur Database

Database disimpan di `data/corpsec.db` (auto-generated). Tabel utama:

- `agenda` — jadwal Direksi
- `memorandum` — memorandum dan hasil analisis AI
- `media_articles` — artikel media monitoring
- `meetings` / `meeting_followups` — rapat dan tindak lanjut
- `knowledge_documents` — basis pengetahuan RAG
- `regulatory_notifications` — notifikasi regulator
- `sla_records` — pencatatan SLA
