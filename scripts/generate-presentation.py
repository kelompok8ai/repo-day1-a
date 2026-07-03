#!/usr/bin/env python3
"""CorpSec Bank Sumut — Business Problem Canvas presentation."""

from pathlib import Path

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN
from pptx.util import Inches, Pt

NAVY = RGBColor(0x0C, 0x23, 0x40)
ORANGE = RGBColor(0xF5, 0x82, 0x20)
ORANGE_LIGHT = RGBColor(0xFF, 0xF4, 0xEB)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
BG = RGBColor(0xF8, 0xFA, 0xFC)
SLATE = RGBColor(0x64, 0x74, 0x8B)
TEXT = RGBColor(0x1E, 0x29, 0x3B)
RED_SOFT = RGBColor(0xFE, 0xF2, 0xF2)
GREEN_SOFT = RGBColor(0xF0, 0xFD, 0xF4)

ROOT = Path(__file__).resolve().parent.parent
OUTPUT = ROOT / "CorpSec-Bank-Sumut-Presentasi.pptx"
SCREENSHOTS = ROOT / "docs" / "screenshots"
LOGO = ROOT / "docs" / "logo-banksumut.png"


def ensure_logo():
    """Convert SVG logo to PNG if needed."""
    if LOGO.exists():
        return
    svg = ROOT / "public" / "images" / "logo-banksumut.svg"
    if not svg.exists():
        return
    try:
        import cairosvg
        cairosvg.svg2png(url=str(svg), write_to=str(LOGO), output_width=240, output_height=240)
    except Exception:
        pass


def add_logo(slide, top=0.22, right=0.4, size=0.52):
    """Bank Sumut logo — pojok kanan atas setiap slide."""
    ensure_logo()
    if not LOGO.exists():
        return
    left = 13.333 - right - size
    slide.shapes.add_picture(str(LOGO), Inches(left), Inches(top), width=Inches(size), height=Inches(size))


def bg(slide, color):
    slide.background.fill.solid()
    slide.background.fill.fore_color.rgb = color


def footer(slide, n: int):
    bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, Inches(7.05), Inches(13.333), Inches(0.45))
    bar.fill.solid()
    bar.fill.fore_color.rgb = NAVY
    bar.line.fill.background()

    ensure_logo()
    if LOGO.exists():
        slide.shapes.add_picture(str(LOGO), Inches(0.18), Inches(7.06), width=Inches(0.34), height=Inches(0.34))

    l = slide.shapes.add_textbox(Inches(0.58), Inches(7.1), Inches(6), Inches(0.35))
    p = l.text_frame.paragraphs[0]
    p.text = "CorpSec Bank Sumut — Business Problem Canvas"
    p.font.size = Pt(11)
    p.font.bold = True
    p.font.color.rgb = ORANGE
    r = slide.shapes.add_textbox(Inches(11.5), Inches(7.1), Inches(1.5), Inches(0.35))
    p = r.text_frame.paragraphs[0]
    p.text = str(n)
    p.font.size = Pt(11)
    p.font.color.rgb = WHITE
    p.alignment = PP_ALIGN.RIGHT
    add_logo(slide)


def title_block(slide, title: str, subtitle: str = ""):
    acc = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(0.18), Inches(7.05))
    acc.fill.solid()
    acc.fill.fore_color.rgb = ORANGE
    acc.line.fill.background()
    box = slide.shapes.add_textbox(Inches(0.55), Inches(0.35), Inches(12.2), Inches(1.0))
    tf = box.text_frame
    p = tf.paragraphs[0]
    p.text = title
    p.font.size = Pt(32)
    p.font.bold = True
    p.font.color.rgb = NAVY
    if subtitle:
        p2 = tf.add_paragraph()
        p2.text = subtitle
        p2.font.size = Pt(17)
        p2.font.color.rgb = SLATE
        p2.space_before = Pt(6)


def bullets(slide, items, top=1.5, left=0.55, width=12.2, size=20):
    box = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(width), Inches(5.3))
    tf = box.text_frame
    tf.word_wrap = True
    for i, item in enumerate(items):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = item
        is_sub = item.startswith("   ")
        p.font.size = Pt(size - 3 if is_sub else size)
        p.font.color.rgb = SLATE if is_sub else TEXT
        p.space_after = Pt(12)
        p.line_spacing = 1.2
        if is_sub:
            p.level = 1


def card(slide, x, y, w, h, title, body, header_color=NAVY, body_color=WHITE):
    shape = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x), Inches(y), Inches(w), Inches(h))
    shape.fill.solid()
    shape.fill.fore_color.rgb = body_color
    shape.line.color.rgb = RGBColor(0xE2, 0xE8, 0xF0)

    head = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(x), Inches(y), Inches(w), Inches(0.52))
    head.fill.solid()
    head.fill.fore_color.rgb = header_color
    head.line.fill.background()

    ht = slide.shapes.add_textbox(Inches(x + 0.2), Inches(y + 0.08), Inches(w - 0.4), Inches(0.4))
    p = ht.text_frame.paragraphs[0]
    p.text = title
    p.font.size = Pt(16)
    p.font.bold = True
    p.font.color.rgb = WHITE

    bt = slide.shapes.add_textbox(Inches(x + 0.2), Inches(y + 0.65), Inches(w - 0.4), Inches(h - 0.75))
    tf = bt.text_frame
    tf.word_wrap = True
    for i, line in enumerate(body):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = line
        p.font.size = Pt(14)
        p.font.color.rgb = TEXT
        p.space_after = Pt(6)


def cover(prs, n):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    bg(s, NAVY)
    acc = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(8.5), 0, Inches(4.8), Inches(7.05))
    acc.fill.solid()
    acc.fill.fore_color.rgb = ORANGE
    acc.line.fill.background()

    t1 = s.shapes.add_textbox(Inches(0.7), Inches(2.0), Inches(7.5), Inches(1.2))
    p = t1.text_frame.paragraphs[0]
    p.text = "CorpSec Bank Sumut"
    p.font.size = Pt(44)
    p.font.bold = True
    p.font.color.rgb = WHITE

    t2 = s.shapes.add_textbox(Inches(0.7), Inches(3.3), Inches(7.5), Inches(0.7))
    p = t2.text_frame.paragraphs[0]
    p.text = "Business Problem Canvas"
    p.font.size = Pt(26)
    p.font.color.rgb = ORANGE

    t3 = s.shapes.add_textbox(Inches(0.7), Inches(4.3), Inches(7.5), Inches(1.0))
    tf = t3.text_frame
    p = tf.paragraphs[0]
    p.text = "Presentasi Solusi Digital Corporate Secretary"
    p.font.size = Pt(18)
    p.font.color.rgb = RGBColor(0xBC, 0xCD, 0xDC)
    p2 = tf.add_paragraph()
    p2.text = "PRD Discovery v0.1 — Bank Sumut"
    p2.font.size = Pt(16)
    p2.font.color.rgb = RGBColor(0xBC, 0xCD, 0xDC)

    ensure_logo()
    if LOGO.exists():
        s.shapes.add_picture(str(LOGO), Inches(0.7), Inches(0.55), width=Inches(0.75), height=Inches(0.75))
        brand = s.shapes.add_textbox(Inches(1.6), Inches(0.62), Inches(4), Inches(0.6))
        p = brand.text_frame.paragraphs[0]
        p.text = "Bank Sumut"
        p.font.size = Pt(18)
        p.font.bold = True
        p.font.color.rgb = WHITE

    footer(s, n)


def content(prs, n, title, subtitle, items, size=20):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    bg(s, BG)
    title_block(s, title, subtitle)
    bullets(s, items, size=size)
    footer(s, n)


def canvas_problems(prs, n):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    bg(s, BG)
    title_block(s, "Business Problem Canvas", "Tiga masalah utama dan dampaknya")

    problems = [
        ("Masalah 1", "Proses Memorandum Manual", [
            "Memorandum masih lewat kertas, email, dan chat.",
            "Sulit dilacak status & riwayat keputusan.",
        ], [
            "Dampak:",
            "Approval memakan waktu lama",
            "Dokumen sering tercecer",
            "SLA sulit diukur",
        ]),
        ("Masalah 2", "Agenda & Rapat Terpisah", [
            "Jadwal Direksi dan notulen rapat tidak terpusat.",
            "Tindak lanjut rapat sering tidak terpantau.",
        ], [
            "Dampak:",
            "Agenda tidak terdokumentasi penuh",
            "Follow-up rapat terlambat",
            "Koordinasi antar divisi lemah",
        ]),
        ("Masalah 3", "Compliance Sulit Dipantau", [
            "Tinjauan regulasi dilakukan manual.",
            "Tidak ada arsip terpusat SK/SE/SOP & regulasi OJK/BI.",
        ], [
            "Dampak:",
            "Risiko kepatuhan meningkat",
            "CorpSec beban kerja tinggi",
            "Keputusan tidak konsisten",
        ]),
    ]

    for i, (num, title, prob, impact) in enumerate(problems):
        x = 0.45 + i * 4.25
        card(s, x, 1.55, 4.0, 2.35, f"{num}: {title}", prob, header_color=NAVY)
        card(s, x, 4.05, 4.0, 2.35, "Dampak", impact, header_color=ORANGE, body_color=ORANGE_LIGHT)

    footer(s, n)


def prd_summary(prs, n):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    bg(s, BG)
    title_block(s, "Ringkasan PRD Terpilih", "Fokus solusi berdasarkan kebutuhan CorpSec Bank Sumut")

    card(s, 0.45, 1.45, 5.9, 2.5, "Masalah yang Diatasi", [
        "Proses memorandum lambat & tidak terlacak",
        "Agenda Direksi belum terdigitalisasi",
        "Compliance review manual & tidak standar",
        "Tidak ada monitoring SLA terpusat",
    ])
    card(s, 6.85, 1.45, 5.9, 2.5, "Alasan Solusi Dibuat", [
        "Mengurangi penggunaan kertas (target -90%)",
        "Mempercepat approval (target -50% waktu)",
        "Resume tinjauan < 5 menit",
        "SLA memorandum ≥ 95%",
    ])

    card(s, 0.45, 4.15, 5.9, 2.35, "User Utama", [
        "Corporate Secretary (pengelola utama)",
        "Divisi Pengusul (pengirim memorandum)",
        "Pemimpin Bidang (persetujuan awal)",
        "Sekretaris Direksi/Komisaris",
        "Direksi & Komisaris (keputusan akhir)",
    ])
    card(s, 6.85, 4.15, 5.9, 2.35, "Fitur Utama", [
        "Dashboard & laporan statistik",
        "Memorandum digital + workflow 7 level",
        "Agenda, rapat, & tindak lanjut",
        "Media monitoring & knowledge base",
        "SLA monitoring & bantuan tinjauan dokumen",
    ])

    footer(s, n)


def app_features_benefits(prs, n):
    """Fitur utama & nilai manfaat — tanpa teks tampilan, itu pakai screenshot."""
    s = prs.slides.add_slide(prs.slide_layouts[6])
    bg(s, BG)
    title_block(s, "Fitur Utama & Nilai Manfaat", "Ringkasan kemampuan aplikasi CorpSec Bank Sumut")

    card(s, 0.45, 1.45, 5.9, 5.0, "Fitur Utama", [
        "Upload & kelola memorandum PDF",
        "Alur persetujuan 7 tahap",
        "Bantuan rangkum isi memorandum",
        "Tanda tangan digital saat approval",
        "Agenda Direksi, rapat, media, arsip dokumen",
        "Pemantauan SLA & laporan KPI",
    ])
    card(s, 6.85, 1.45, 5.9, 5.0, "Nilai Manfaat", [
        "Proses lebih cepat & terlacak",
        "Mengurangi kertas & duplikasi data",
        "Keputusan lebih terdokumentasi",
        "CorpSec punya dashboard terpusat",
        "Setiap role hanya lihat tugasnya",
        "Siap demo untuk evaluasi internal",
    ], header_color=ORANGE)

    footer(s, n)


def add_image_with_label(slide, img_path: Path, label: str, x, y, w, h, label_size=13):
    """Add screenshot with rounded frame and caption."""
    if not img_path.exists():
        return
    frame = slide.shapes.add_shape(
        MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x - 0.06), Inches(y - 0.06), Inches(w + 0.12), Inches(h + 0.42)
    )
    frame.fill.solid()
    frame.fill.fore_color.rgb = WHITE
    frame.line.color.rgb = RGBColor(0xE2, 0xE8, 0xF0)

    slide.shapes.add_picture(str(img_path), Inches(x), Inches(y), width=Inches(w), height=Inches(h))

    cap = slide.shapes.add_textbox(Inches(x), Inches(y + h + 0.04), Inches(w), Inches(0.32))
    p = cap.text_frame.paragraphs[0]
    p.text = label
    p.font.size = Pt(label_size)
    p.font.bold = True
    p.font.color.rgb = NAVY
    p.alignment = PP_ALIGN.CENTER


def website_display_slide(prs, n: int, title: str, subtitle: str, images: list[tuple[str, str, float, float, float, float]]):
    """Slide khusus tampilan website — dominan gambar, bukan teks."""
    s = prs.slides.add_slide(prs.slide_layouts[6])
    bg(s, BG)
    title_block(s, title, subtitle)
    for filename, label, x, y, w, h in images:
        add_image_with_label(s, SCREENSHOTS / filename, label, x, y, w, h)
    footer(s, n)


def ux_slide(prs, n):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    bg(s, BG)
    title_block(s, "Perbaikan Aspek User Experience", "Yang sudah diterapkan dan rencana perbaikan")

    card(s, 0.45, 1.45, 5.9, 5.0, "Sudah Diterapkan", [
        "Desain UI mengikuti identitas Bank Sumut (navy & oranye)",
        "Login page dengan hero image & akun demo cepat",
        "Navigasi sidebar per role — tidak membingungkan",
        "Workflow stepper visual di detail memorandum",
        "Indikator baca (belum/sudah dibaca) pada daftar memo",
        "Dashboard hero banner & stat cards informatif",
        "Redirect otomatis ke halaman sesuai role setelah login",
        "Sidebar mobile dengan menu hamburger",
    ], header_color=RGBColor(0x05, 0x96, 0x69))

    card(s, 6.85, 1.45, 5.9, 5.0, "Rencana Perbaikan UX", [
        "Notifikasi real-time (toast & badge) saat ada dokumen baru",
        "Loading state & feedback saat upload PDF",
        "Halaman error yang lebih informatif",
        "Pencarian & filter di daftar memorandum",
        "Mode gelap (dark mode) opsional",
        "Panduan singkat (onboarding) untuk user baru",
        "Optimasi tampilan tablet & HP",
        "Akses cepat ke rapat & media dari sidebar CorpSec",
    ], header_color=ORANGE)

    footer(s, n)


def security_slide(prs, n):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    bg(s, BG)
    title_block(s, "Perbaikan Aspek Keamanan", "Kondisi saat ini dan langkah penguatan")

    card(s, 0.45, 1.45, 5.9, 5.0, "Sudah Diterapkan", [
        "Login wajib — halaman dilindungi middleware",
        "Pembagian akses per role (RBAC 7 level)",
        "Cookie session httpOnly & sameSite=lax",
        "API memorandum dicek role sebelum aksi (requireApiRole)",
        "Redirect otomatis jika akses halaman tidak sesuai role",
        "Validasi file upload (format PDF, batas ukuran)",
    ], header_color=RGBColor(0x05, 0x96, 0x69))

    card(s, 6.85, 1.45, 5.9, 5.0, "Perlu Ditingkatkan", [
        "Session cookie perlu ditandatangani (JWT/signed cookie)",
        "Password disimpan plaintext — perlu bcrypt/hash",
        "Belum ada rate limiting pada login",
        "Belum ada security headers (CSP, HSTS, X-Frame)",
        "Belum ada audit log aktivitas user",
        "Perlu validasi input lebih ketat di semua API",
        "Enkripsi file PDF di storage server",
        "Integrasi SSO Active Directory Bank Sumut",
    ], header_color=RGBColor(0xDC, 0x26, 0x26))

    footer(s, n)


def roadmap(prs, n):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    bg(s, BG)
    title_block(s, "Rencana Langkah Selanjutnya", "Prioritas pengembangan ke depan")

    phases = [
        ("Fase 1 — Stabilisasi", [
            "Perbaiki keamanan: hash password, signed session",
            "Tambah rate limiting & security headers",
            "Lengkapi audit log aktivitas",
            "Uji coba internal dengan user CorpSec",
        ]),
        ("Fase 2 — Peningkatan Fitur", [
            "Integrasi LLM nyata untuk tinjauan memorandum",
            "Notifikasi email/SMS saat approval & SLA breach",
            "Export laporan PDF/Excel",
            "Koneksi ke SMD Bank Sumut",
        ]),
        ("Fase 3 — Go Live", [
            "Integrasi SSO Active Directory",
            "Migrasi database ke PostgreSQL production",
            "Penetration testing & UAT formal",
            "Pelatihan user & rollout ke seluruh divisi",
        ]),
    ]

    for i, (phase, items) in enumerate(phases):
        x = 0.45 + i * 4.25
        card(s, x, 1.55, 4.0, 4.85, phase, items, header_color=NAVY if i == 0 else ORANGE if i == 1 else RGBColor(0x05, 0x96, 0x69))

    footer(s, n)


def closing(prs, n):
    s = prs.slides.add_slide(prs.slide_layouts[6])
    bg(s, NAVY)
    bar = s.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, Inches(3.2), Inches(13.333), Inches(0.08))
    bar.fill.solid()
    bar.fill.fore_color.rgb = ORANGE
    bar.line.fill.background()

    t1 = s.shapes.add_textbox(Inches(0.7), Inches(2.2), Inches(12), Inches(1))
    p = t1.text_frame.paragraphs[0]
    p.text = "Terima Kasih"
    p.font.size = Pt(46)
    p.font.bold = True
    p.font.color.rgb = WHITE
    p.alignment = PP_ALIGN.CENTER

    t2 = s.shapes.add_textbox(Inches(0.7), Inches(3.55), Inches(12), Inches(0.8))
    p = t2.text_frame.paragraphs[0]
    p.text = "CorpSec Bank Sumut — Solusi Digital Corporate Secretary"
    p.font.size = Pt(22)
    p.font.color.rgb = ORANGE
    p.alignment = PP_ALIGN.CENTER

    t3 = s.shapes.add_textbox(Inches(0.7), Inches(4.5), Inches(12), Inches(0.6))
    p = t3.text_frame.paragraphs[0]
    p.text = "Demo: localhost:3000/login  |  GitHub: kelompok8ai/repo-day1-a"
    p.font.size = Pt(16)
    p.font.color.rgb = RGBColor(0xBC, 0xCD, 0xDC)
    p.alignment = PP_ALIGN.CENTER

    ensure_logo()
    if LOGO.exists():
        s.shapes.add_picture(str(LOGO), Inches(0.7), Inches(0.55), width=Inches(0.75), height=Inches(0.75))
        brand = s.shapes.add_textbox(Inches(1.6), Inches(0.62), Inches(4), Inches(0.6))
        p = brand.text_frame.paragraphs[0]
        p.text = "Bank Sumut"
        p.font.size = Pt(18)
        p.font.bold = True
        p.font.color.rgb = WHITE

    footer(s, n)


def build():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    cover(prs, 1)
    canvas_problems(prs, 2)
    prd_summary(prs, 3)

    # Tampilan website — screenshot asli, bukan teks
    website_display_slide(prs, 4, "Tampilan Website", "Halaman Login — pintu masuk aplikasi CorpSec Bank Sumut", [
        ("01-login.png", "Halaman Login", 1.2, 1.35, 10.9, 4.55),
    ])
    website_display_slide(prs, 5, "Tampilan Website", "Dashboard Corporate Secretary — ringkasan operasional harian", [
        ("02-dashboard.png", "Dashboard CorpSec", 0.45, 1.35, 12.2, 4.55),
    ])
    website_display_slide(prs, 6, "Tampilan Website", "Modul Memorandum & Portal Divisi Pengusul", [
        ("03-memorandum.png", "Manajemen Memorandum", 0.45, 1.35, 5.9, 4.55),
        ("04-pengusul.png", "Beranda Divisi Pengusul", 6.85, 1.35, 5.9, 4.55),
    ])
    website_display_slide(prs, 7, "Tampilan Website", "Review Pimpinan Bidang & Agenda Direksi", [
        ("05-pimpinan.png", "Review Memorandum — Pimpinan Bidang", 0.45, 1.35, 5.9, 4.55),
        ("06-agenda.png", "Manajemen Agenda Direksi", 6.85, 1.35, 5.9, 4.55),
    ])

    app_features_benefits(prs, 8)

    content(prs, 9, "Modul Sistem", "Delapan modul operasional dalam satu platform", [
        "Dashboard — ringkasan harian CorpSec (agenda, memo, SLA, notifikasi)",
        "Memorandum — upload PDF, tinjauan, workflow 7 level, tanda tangan",
        "Agenda Direksi — jadwal kegiatan & catatan persiapan",
        "Rapat — notulen & tindak lanjut dengan penanggung jawab",
        "Media Monitoring — berita Bank Sumut & analisis sentimen",
        "Knowledge Base — arsip SK/SE/SOP & regulasi OJK/BI",
        "SLA Monitoring — pantau target waktu ≥ 95%",
        "Laporan — statistik & KPI success metrics PRD",
    ], size=19)
    content(prs, 10, "Alur Kerja Memorandum", "7 tahap persetujuan sesuai PRD", [
        "1. Divisi Pengusul — kirim memorandum PDF",
        "2. Corporate Secretary — terima, rangkum, & tinjau kelengkapan",
        "3. Pemimpin Bidang — setujui atau tolak + tanda tangan",
        "4. Sekretaris Direksi/Komisaris — teruskan ke pimpinan",
        "5. Direksi / Komisaris — beri keputusan",
        "6. CorpSec — finalisasi sesuai keputusan board",
        "7. Kembali ke Pengusul — pemberitahuan hasil akhir",
    ], size=20)
    ux_slide(prs, 11)
    security_slide(prs, 12)
    roadmap(prs, 13)
    closing(prs, 14)

    return prs


def main():
    prs = build()
    prs.save(str(OUTPUT))
    docs = ROOT / "docs" / "CorpSec-Bank-Sumut-Presentasi.pptx"
    docs.parent.mkdir(exist_ok=True)
    prs.save(str(docs))
    print(f"Saved: {OUTPUT} ({len(prs.slides)} slides)")


if __name__ == "__main__":
    main()
