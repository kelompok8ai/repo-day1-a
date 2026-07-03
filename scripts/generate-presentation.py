#!/usr/bin/env python3
"""Generate CorpSec Bank Sumut presentation (PPTX) — 15 slides."""

from pathlib import Path

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN
from pptx.util import Inches, Pt

NAVY = RGBColor(0x0C, 0x23, 0x40)
NAVY_MID = RGBColor(0x15, 0x34, 0x5C)
ORANGE = RGBColor(0xF5, 0x82, 0x20)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
LIGHT_GRAY = RGBColor(0xF4, 0xF6, 0xF9)
SLATE = RGBColor(0x64, 0x74, 0x8B)
DARK_TEXT = RGBColor(0x1E, 0x29, 0x3B)

OUTPUT = Path(__file__).resolve().parent.parent / "docs" / "CorpSec-Bank-Sumut-Presentasi.pptx"


def set_slide_bg(slide, color: RGBColor):
    fill = slide.background.fill
    fill.solid()
    fill.fore_color.rgb = color


def add_accent_bar(slide, top=Inches(0), height=Inches(0.08)):
    shape = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE, Inches(0), top, Inches(13.333), height
    )
    shape.fill.solid()
    shape.fill.fore_color.rgb = ORANGE
    shape.line.fill.background()


def add_footer(slide, text: str):
    box = slide.shapes.add_textbox(Inches(0.5), Inches(7.0), Inches(12.3), Inches(0.4))
    p = box.text_frame.paragraphs[0]
    p.text = text
    p.font.size = Pt(9)
    p.font.color.rgb = SLATE
    p.alignment = PP_ALIGN.RIGHT


def add_title_slide(prs, title: str, subtitle: str, extra: str = ""):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, NAVY)
    add_accent_bar(slide, top=Inches(0), height=Inches(0.12))

    circle = slide.shapes.add_shape(
        MSO_SHAPE.OVAL, Inches(9.5), Inches(-1), Inches(5), Inches(5)
    )
    circle.fill.solid()
    circle.fill.fore_color.rgb = ORANGE
    circle.fill.transparency = 0.85
    circle.line.fill.background()

    title_box = slide.shapes.add_textbox(Inches(0.8), Inches(2.2), Inches(11), Inches(1.5))
    p = title_box.text_frame.paragraphs[0]
    p.text = title
    p.font.size = Pt(40)
    p.font.bold = True
    p.font.color.rgb = WHITE

    sub_box = slide.shapes.add_textbox(Inches(0.8), Inches(3.8), Inches(10), Inches(1))
    p = sub_box.text_frame.paragraphs[0]
    p.text = subtitle
    p.font.size = Pt(20)
    p.font.color.rgb = ORANGE

    if extra:
        ex_box = slide.shapes.add_textbox(Inches(0.8), Inches(5.0), Inches(10), Inches(0.8))
        p = ex_box.text_frame.paragraphs[0]
        p.text = extra
        p.font.size = Pt(14)
        p.font.color.rgb = RGBColor(0xBC, 0xCD, 0xDC)

    add_footer(slide, "Bank Sumut — Corporate Secretary Digital Platform | PRD v0.1")


def add_content_slide(prs, title: str, bullets: list[str], subtitle: str = ""):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, WHITE)
    add_accent_bar(slide)

    title_box = slide.shapes.add_textbox(Inches(0.6), Inches(0.35), Inches(12), Inches(0.7))
    p = title_box.text_frame.paragraphs[0]
    p.text = title
    p.font.size = Pt(28)
    p.font.bold = True
    p.font.color.rgb = NAVY

    line = slide.shapes.add_shape(
        MSO_SHAPE.RECTANGLE, Inches(0.6), Inches(1.05), Inches(1.5), Inches(0.05)
    )
    line.fill.solid()
    line.fill.fore_color.rgb = ORANGE
    line.line.fill.background()

    y_start = 1.35
    if subtitle:
        sub_box = slide.shapes.add_textbox(Inches(0.6), Inches(y_start), Inches(12), Inches(0.5))
        p = sub_box.text_frame.paragraphs[0]
        p.text = subtitle
        p.font.size = Pt(13)
        p.font.color.rgb = SLATE
        y_start += 0.45

    body_box = slide.shapes.add_textbox(Inches(0.6), Inches(y_start), Inches(12), Inches(5.8))
    tf = body_box.text_frame
    tf.word_wrap = True
    for i, item in enumerate(bullets):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = item
        p.font.size = Pt(15)
        p.font.color.rgb = DARK_TEXT
        p.space_after = Pt(8)
        if item.startswith("  "):
            p.level = 1
            p.font.size = Pt(13)
            p.font.color.rgb = SLATE

    add_footer(slide, "CorpSec Bank Sumut — PRD Discovery v0.1")


def add_table_slide(prs, title: str, headers: list[str], rows: list[list[str]]):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_slide_bg(slide, WHITE)
    add_accent_bar(slide)

    title_box = slide.shapes.add_textbox(Inches(0.6), Inches(0.35), Inches(12), Inches(0.7))
    p = title_box.text_frame.paragraphs[0]
    p.text = title
    p.font.size = Pt(28)
    p.font.bold = True
    p.font.color.rgb = NAVY

    cols = len(headers)
    row_h = min(0.42, 5.5 / max(len(rows) + 1, 1))
    table_shape = slide.shapes.add_table(
        len(rows) + 1, cols, Inches(0.5), Inches(1.25), Inches(12.3), Inches(row_h * (len(rows) + 1))
    )
    table = table_shape.table

    for j, header in enumerate(headers):
        cell = table.cell(0, j)
        cell.text = header
        cell.fill.solid()
        cell.fill.fore_color.rgb = NAVY
        for paragraph in cell.text_frame.paragraphs:
            paragraph.font.bold = True
            paragraph.font.size = Pt(11)
            paragraph.font.color.rgb = WHITE

    for i, row in enumerate(rows, start=1):
        for j, value in enumerate(row):
            cell = table.cell(i, j)
            cell.text = value
            if i % 2 == 0:
                cell.fill.solid()
                cell.fill.fore_color.rgb = LIGHT_GRAY
            for paragraph in cell.text_frame.paragraphs:
                paragraph.font.size = Pt(10)
                paragraph.font.color.rgb = DARK_TEXT

    add_footer(slide, "CorpSec Bank Sumut — PRD Discovery v0.1")


def build_presentation() -> Presentation:
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    # Slide 1 — Cover
    add_title_slide(
        prs,
        "CorpSec Bank Sumut",
        "Corporate Secretary Digital Platform",
        "Presentasi Produk — PRD Discovery v0.1 | Juli 2026",
    )

    # Slide 2 — Latar Belakang
    add_content_slide(
        prs,
        "Latar Belakang & Tantangan",
        [
            "Corporate Secretary Bank Sumut mengelola memorandum, agenda Direksi, rapat, dan compliance.",
            "Proses manual masih mengandalkan kertas & email — approval lambat, sulit dilacak.",
            "PRD Discovery v0.1 mendefinisikan kebutuhan digitalisasi end-to-end CorpSec.",
            "Solusi: platform terintegrasi dengan workflow 7 level, AI review, & SLA monitoring.",
        ],
        subtitle="Mengapa platform digital CorpSec dibutuhkan?",
    )

    # Slide 3 — Visi & Ruang Lingkup PRD
    add_content_slide(
        prs,
        "Visi Produk & Ruang Lingkup PRD",
        [
            "Satu platform untuk seluruh operasional Corporate Secretary Bank Sumut.",
            "Memorandum digital — upload PDF hingga keputusan final Direksi/Komisaris.",
            "AI compliance review dengan referensi SMD & regulasi OJK/BI.",
            "Modul terintegrasi: Dashboard, Agenda, Rapat, Media, Knowledge, SLA, Laporan.",
            "Tanda tangan digital & notifikasi in-app di setiap tahap approval.",
        ],
    )

    # Slide 4 — Tech Stack
    add_table_slide(
        prs,
        "Arsitektur Teknologi",
        ["Layer", "Teknologi", "Fungsi"],
        [
            ["Frontend", "Next.js 16 + React 19", "App Router, UI responsif"],
            ["Database", "SQLite + Drizzle ORM", "11 tabel, auto-seed demo"],
            ["Styling", "Tailwind CSS v4", "Brand navy & orange Bank Sumut"],
            ["Grafik", "Recharts", "Dashboard & laporan statistik"],
            ["PDF & AI", "pdf-parse + RAG", "Ekstraksi teks & analisa compliance"],
            ["Auth", "Cookie Session + RBAC", "7 role, middleware guard"],
        ],
    )

    # Slide 5 — Modul Website
    add_table_slide(
        prs,
        "Modul Utama Website",
        ["Modul", "Route", "Fungsi"],
        [
            ["Dashboard", "/dashboard", "Statistik, grafik, notifikasi, aksi cepat"],
            ["Memorandum", "/dashboard/memorandum", "Upload PDF, workflow, AI review"],
            ["Agenda", "/agenda", "Jadwal & persiapan kegiatan Direksi"],
            ["Rapat", "/rapat", "Notulen & tindak lanjut rapat"],
            ["Media", "/media", "Berita & analisis sentimen"],
            ["Knowledge", "/knowledge", "Dokumen internal & regulasi (RAG)"],
            ["SLA & Laporan", "/sla, /laporan", "Monitoring SLA & KPI PRD"],
        ],
    )

    # Slide 6 — Dashboard & Memorandum
    add_content_slide(
        prs,
        "Dashboard & Manajemen Memorandum",
        [
            "Dashboard CorpSec — pusat kendali operasional:",
            "  • Stat cards: agenda, memorandum pending, SLA, notifikasi regulator",
            "  • Grafik: statistik memorandum, tren bulanan, tren SLA",
            "  • Notifikasi keputusan Pimpinan Bidang & aksi cepat upload",
            "Manajemen Memorandum:",
            "  • Upload PDF (max 20 MB) + metadata (perihal, divisi, urgensi)",
            "  • Indikator baca, status workflow, aging, AI score",
            "  • PDF viewer, workflow stepper, tanda tangan digital",
        ],
    )

    # Slide 7 — Workflow 7 Level
    add_content_slide(
        prs,
        "Workflow Persetujuan 7 Level",
        [
            "1. Divisi Pengusul — Upload & kirim memorandum PDF",
            "2. Corporate Secretary — Analisa AI & review compliance",
            "3. Pemimpin Bidang — Approve/tolak + tanda tangan digital",
            "4. Sekretaris Direksi/Komisaris — Terima & forward ke board",
            "5. Direksi (5 anggota) / Komisaris (3 anggota) — Keputusan board",
            "6. CorpSec — Finalisasi keputusan board",
            "7. Kembali ke Pengusul — Notifikasi keputusan final",
        ],
        subtitle="Cabang rute: Direksi (via SekDir) atau Komisaris (via SekKom)",
    )

    # Slide 8 — RBAC
    add_table_slide(
        prs,
        "Role-Based Access Control — 7 Role",
        ["Role", "Route", "Akses Utama"],
        [
            ["Divisi Pengusul", "/pengusul", "Kirim PDF, riwayat keputusan"],
            ["Corporate Secretary", "/dashboard", "Akses penuh seluruh modul"],
            ["Pemimpin Bidang", "/pimpinan-bidang", "Review, approve/tolak + TTD"],
            ["Sekretaris Direksi", "/sekdireksi", "Terima & forward ke Direksi"],
            ["Sekretaris Komisaris", "/sekretaris-komisaris", "Forward ke Komisaris"],
            ["Direksi", "/direksi", "Keputusan + tanda tangan digital"],
            ["Komisaris", "/komisaris", "Keputusan + disposisi"],
        ],
    )

    # Slide 9 — Akun Demo
    add_table_slide(
        prs,
        "Akun Demo untuk Live Demo",
        ["Role", "Username", "Password"],
        [
            ["Divisi Pengusul", "pengusul", "pengusul123"],
            ["Corporate Secretary", "corpsec", "corpsec123"],
            ["Pemimpin Bidang", "pimpinan", "pimpinan123"],
            ["Sekretaris Direksi", "sekdireksi", "sekdireksi123"],
            ["Sekretaris Komisaris", "sekkom", "sekkom123"],
            ["Direktur Utama", "dirut", "dirut123"],
            ["Direktur IT", "dir_it", "dirit123"],
            ["Komisaris Utama", "kom_utama", "kom123"],
        ],
    )

    # Slide 10 — AI Compliance
    add_content_slide(
        prs,
        "AI Compliance Review",
        [
            "Otomatis saat upload PDF — ekstraksi teks via pdf-parse.",
            "Output analisa AI:",
            "  • SMD Document ID (SMD-BSM-{tahun}-{seq})",
            "  • Ringkasan eksekutif terstruktur",
            "  • Risk Score (0–90) & Compliance Score (85–99%)",
            "  • Referensi regulasi dari Knowledge Base (RAG)",
            "CorpSec dapat edit ringkasan, download review, & re-upload dokumen.",
            "Knowledge Base: SK/SE/SOP internal + regulasi OJK/BI sebagai corpus RAG.",
        ],
    )

    # Slide 11 — Agenda, Rapat, Media
    add_content_slide(
        prs,
        "Agenda, Rapat & Media Monitoring",
        [
            "Agenda Direksi — CRUD jadwal kegiatan, prioritas, catatan persiapan.",
            "Meeting Management — daftar rapat, notulen, tindak lanjut dengan assignee & due date.",
            "Media Monitoring — berita Bank Sumut, regulasi, makroekonomi, perbankan.",
            "  • Analisis sentimen: Positif / Netral / Negatif",
            "  • Sumber: Bisnis Indonesia, Kontan, Reuters, dll.",
            "Notifikasi regulator OJK/BI ditampilkan di dashboard CorpSec.",
        ],
    )

    # Slide 12 — SLA & KPI
    add_table_slide(
        prs,
        "SLA Monitoring & KPI Success Metrics",
        ["KPI (PRD)", "Target", "Implementasi"],
        [
            ["Resume AI", "< 5 menit", "Simulasi ~2 menit otomatis"],
            ["Waktu Approval", "-50%", "Workflow digital 7 level"],
            ["Penggunaan Kertas", "-90%", "Upload & review PDF digital"],
            ["Agenda Terdokumentasi", "100%", "Modul agenda terintegrasi"],
            ["SLA Memorandum", "≥ 95%", "Monitoring real-time di /sla"],
            ["Memorandum Terlambat", "0", "Alert SLA breached"],
        ],
    )

    # Slide 13 — Desain UI
    add_content_slide(
        prs,
        "Desain UI — Branding Bank Sumut",
        [
            "Identitas visual: Navy (#0C2340) + Orange (#F58220).",
            "Login dengan hero panel gambar gedung Bank Sumut.",
            "Sidebar navy gelap, navigasi aktif oranye, logo Bank Sumut.",
            "Dashboard & memorandum dengan banner hero corporate.",
            "Komponen konsisten: workflow stepper, badge status, stat cards, grafik.",
            "Responsive — mobile sidebar dengan hamburger menu.",
        ],
        subtitle="Modern, simple, corporate",
    )

    # Slide 14 — Kesimpulan
    add_content_slide(
        prs,
        "Kesimpulan",
        [
            "Platform CorpSec Bank Sumut mengimplementasikan seluruh ruang lingkup PRD v0.1.",
            "Workflow 7 level + AI review + tanda tangan digital + SLA terintegrasi.",
            "7 role RBAC — dari Divisi Pengusul hingga Direksi/Komisaris.",
            "8 modul operasional dalam satu platform terpadu.",
            "UI modern dengan branding Bank Sumut & data demo lengkap.",
            "Prototype siap demo: http://localhost:3000/login",
        ],
    )

    # Slide 15 — Penutup
    add_title_slide(
        prs,
        "Terima Kasih",
        "CorpSec Bank Sumut — Digital Platform",
        "Demo: http://localhost:3000/login",
    )

    return prs


def main():
    OUTPUT.parent.mkdir(parents=True, exist_ok=True)
    prs = build_presentation()
    prs.save(str(OUTPUT))
    print(f"Presentasi berhasil dibuat: {OUTPUT}")
    print(f"Total slide: {len(prs.slides)}")


if __name__ == "__main__":
    main()
