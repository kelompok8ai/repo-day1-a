#!/usr/bin/env python3
"""Generate CorpSec Bank Sumut presentation — 15 slides, modern & readable."""

from pathlib import Path

from pptx import Presentation
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.util import Inches, Pt

NAVY = RGBColor(0x0C, 0x23, 0x40)
NAVY_SOFT = RGBColor(0x15, 0x34, 0x5C)
ORANGE = RGBColor(0xF5, 0x82, 0x20)
ORANGE_LIGHT = RGBColor(0xFF, 0xF4, 0xEB)
WHITE = RGBColor(0xFF, 0xFF, 0xFF)
BG = RGBColor(0xF8, 0xFA, 0xFC)
SLATE = RGBColor(0x64, 0x74, 0x8B)
TEXT = RGBColor(0x1E, 0x29, 0x3B)

OUTPUT = Path(__file__).resolve().parent.parent / "CorpSec-Bank-Sumut-Presentasi.pptx"


def set_bg(slide, color):
    slide.background.fill.solid()
    slide.background.fill.fore_color.rgb = color


def footer(slide, page: int):
    bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(7.05), Inches(13.333), Inches(0.45))
    bar.fill.solid()
    bar.fill.fore_color.rgb = NAVY
    bar.line.fill.background()

    left = slide.shapes.add_textbox(Inches(0.5), Inches(7.1), Inches(6), Inches(0.35))
    p = left.text_frame.paragraphs[0]
    p.text = "CorpSec Bank Sumut"
    p.font.size = Pt(11)
    p.font.color.rgb = ORANGE
    p.font.bold = True

    right = slide.shapes.add_textbox(Inches(11.5), Inches(7.1), Inches(1.5), Inches(0.35))
    p = right.text_frame.paragraphs[0]
    p.text = str(page)
    p.font.size = Pt(11)
    p.font.color.rgb = WHITE
    p.alignment = PP_ALIGN.RIGHT


def slide_title(slide, title: str, subtitle: str = ""):
    accent = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(0), Inches(0.18), Inches(7.05))
    accent.fill.solid()
    accent.fill.fore_color.rgb = ORANGE
    accent.line.fill.background()

    box = slide.shapes.add_textbox(Inches(0.55), Inches(0.35), Inches(12.2), Inches(1.1))
    tf = box.text_frame
    p = tf.paragraphs[0]
    p.text = title
    p.font.size = Pt(34)
    p.font.bold = True
    p.font.color.rgb = NAVY

    if subtitle:
        p2 = tf.add_paragraph()
        p2.text = subtitle
        p2.font.size = Pt(17)
        p2.font.color.rgb = SLATE
        p2.space_before = Pt(6)


def add_bullets(slide, items: list[str], top=1.55, left=0.55, width=12.2, size=20):
    box = slide.shapes.add_textbox(Inches(left), Inches(top), Inches(width), Inches(5.2))
    tf = box.text_frame
    tf.word_wrap = True
    for i, item in enumerate(items):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.text = item
        p.font.size = Pt(size - 2 if item.startswith("   ") else size)
        p.font.color.rgb = SLATE if item.startswith("   ") else TEXT
        p.space_after = Pt(14)
        p.line_spacing = 1.25
        if item.startswith("   "):
            p.level = 1


def cover_slide(prs, page: int):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(slide, NAVY)

    # Orange diagonal accent
    tri = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(8.2), Inches(0), Inches(5.2), Inches(7.05))
    tri.fill.solid()
    tri.fill.fore_color.rgb = ORANGE
    tri.line.fill.background()
    tri.rotation = 0

    logo = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(0.7), Inches(0.7), Inches(1.1), Inches(1.1))
    logo.fill.solid()
    logo.fill.fore_color.rgb = ORANGE
    logo.line.fill.background()

    lt = slide.shapes.add_textbox(Inches(0.85), Inches(0.88), Inches(0.8), Inches(0.6))
    p = lt.text_frame.paragraphs[0]
    p.text = "BS"
    p.font.size = Pt(28)
    p.font.bold = True
    p.font.color.rgb = WHITE
    p.alignment = PP_ALIGN.CENTER

    t1 = slide.shapes.add_textbox(Inches(0.7), Inches(2.3), Inches(7.5), Inches(1.4))
    p = t1.text_frame.paragraphs[0]
    p.text = "CorpSec Bank Sumut"
    p.font.size = Pt(46)
    p.font.bold = True
    p.font.color.rgb = WHITE

    t2 = slide.shapes.add_textbox(Inches(0.7), Inches(3.75), Inches(7.5), Inches(0.8))
    p = t2.text_frame.paragraphs[0]
    p.text = "Platform Corporate Secretary Digital"
    p.font.size = Pt(24)
    p.font.color.rgb = ORANGE

    t3 = slide.shapes.add_textbox(Inches(0.7), Inches(4.8), Inches(7.5), Inches(1.2))
    tf = t3.text_frame
    p = tf.paragraphs[0]
    p.text = "Presentasi Sistem"
    p.font.size = Pt(18)
    p.font.color.rgb = RGBColor(0xBC, 0xCD, 0xDC)
    p2 = tf.add_paragraph()
    p2.text = "Juli 2026"
    p2.font.size = Pt(18)
    p2.font.color.rgb = RGBColor(0xBC, 0xCD, 0xDC)

    footer(slide, page)


def content_slide(prs, page: int, title: str, subtitle: str, bullets: list[str]):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(slide, BG)
    slide_title(slide, title, subtitle)
    add_bullets(slide, bullets, size=21)
    footer(slide, page)


def two_col_slide(prs, page: int, title: str, left_title: str, left_items: list[str], right_title: str, right_items: list[str]):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(slide, BG)
    slide_title(slide, title)

    for x, col_title, items in [(0.55, left_title, left_items), (6.85, right_title, right_items)]:
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x), Inches(1.55), Inches(5.9), Inches(5.1))
        card.fill.solid()
        card.fill.fore_color.rgb = WHITE
        card.line.color.rgb = RGBColor(0xE2, 0xE8, 0xF0)

        head = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(x), Inches(1.55), Inches(5.9), Inches(0.55))
        head.fill.solid()
        head.fill.fore_color.rgb = NAVY
        head.line.fill.background()

        ht = slide.shapes.add_textbox(Inches(x + 0.25), Inches(1.62), Inches(5.4), Inches(0.45))
        p = ht.text_frame.paragraphs[0]
        p.text = col_title
        p.font.size = Pt(18)
        p.font.bold = True
        p.font.color.rgb = WHITE

        add_bullets(slide, items, top=2.3, left=x + 0.3, width=5.3, size=18)

    footer(slide, page)


def table_slide(prs, page: int, title: str, subtitle: str, headers: list[str], rows: list[list[str]]):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(slide, BG)
    slide_title(slide, title, subtitle)

    cols = len(headers)
    n = len(rows) + 1
    h = min(0.55, 4.8 / n)
    tbl = slide.shapes.add_table(n, cols, Inches(0.55), Inches(1.65), Inches(12.2), Inches(h * n)).table

    for j, htxt in enumerate(headers):
        c = tbl.cell(0, j)
        c.text = htxt
        c.fill.solid()
        c.fill.fore_color.rgb = NAVY
        for p in c.text_frame.paragraphs:
            p.font.bold = True
            p.font.size = Pt(15)
            p.font.color.rgb = WHITE

    for i, row in enumerate(rows, 1):
        for j, val in enumerate(row):
            c = tbl.cell(i, j)
            c.text = val
            if i % 2 == 0:
                c.fill.solid()
                c.fill.fore_color.rgb = ORANGE_LIGHT
            for p in c.text_frame.paragraphs:
                p.font.size = Pt(14)
                p.font.color.rgb = TEXT

    footer(slide, page)


def highlight_slide(prs, page: int, title: str, points: list[tuple[str, str]]):
    """Big number/card style slide."""
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(slide, BG)
    slide_title(slide, title)

    cols = len(points)
    w = 12.2 / cols - 0.2
    for idx, (num, label) in enumerate(points):
        x = 0.55 + idx * (w + 0.25)
        card = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x), Inches(2.0), Inches(w), Inches(3.8))
        card.fill.solid()
        card.fill.fore_color.rgb = WHITE
        card.line.color.rgb = RGBColor(0xE2, 0xE8, 0xF0)

        nb = slide.shapes.add_textbox(Inches(x), Inches(2.4), Inches(w), Inches(1.2))
        p = nb.text_frame.paragraphs[0]
        p.text = num
        p.font.size = Pt(52)
        p.font.bold = True
        p.font.color.rgb = ORANGE
        p.alignment = PP_ALIGN.CENTER

        lb = slide.shapes.add_textbox(Inches(x + 0.2), Inches(3.8), Inches(w - 0.4), Inches(1.5))
        tf = lb.text_frame
        tf.word_wrap = True
        p = tf.paragraphs[0]
        p.text = label
        p.font.size = Pt(17)
        p.font.color.rgb = TEXT
        p.alignment = PP_ALIGN.CENTER

    footer(slide, page)


def closing_slide(prs, page: int):
    slide = prs.slides.add_slide(prs.slide_layouts[6])
    set_bg(slide, NAVY)

    bar = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0), Inches(3.2), Inches(13.333), Inches(0.08))
    bar.fill.solid()
    bar.fill.fore_color.rgb = ORANGE
    bar.line.fill.background()

    t1 = slide.shapes.add_textbox(Inches(0.7), Inches(2.2), Inches(12), Inches(1))
    p = t1.text_frame.paragraphs[0]
    p.text = "Terima Kasih"
    p.font.size = Pt(48)
    p.font.bold = True
    p.font.color.rgb = WHITE
    p.alignment = PP_ALIGN.CENTER

    t2 = slide.shapes.add_textbox(Inches(0.7), Inches(3.55), Inches(12), Inches(0.8))
    p = t2.text_frame.paragraphs[0]
    p.text = "CorpSec Bank Sumut — Platform Corporate Secretary Digital"
    p.font.size = Pt(22)
    p.font.color.rgb = ORANGE
    p.alignment = PP_ALIGN.CENTER

    t3 = slide.shapes.add_textbox(Inches(0.7), Inches(4.5), Inches(12), Inches(0.6))
    p = t3.text_frame.paragraphs[0]
    p.text = "localhost:3000/login"
    p.font.size = Pt(18)
    p.font.color.rgb = RGBColor(0xBC, 0xCD, 0xDC)
    p.alignment = PP_ALIGN.CENTER

    footer(slide, page)


def build():
    prs = Presentation()
    prs.slide_width = Inches(13.333)
    prs.slide_height = Inches(7.5)

    # 1 Cover
    cover_slide(prs, 1)

    # 2 Latar belakang
    content_slide(
        prs, 2,
        "Kenapa Sistem Ini Dibuat?",
        "Permasalahan yang dihadapi Corporate Secretary",
        [
            "Memorandum masih banyak lewat kertas dan email, sehingga sulit dilacak.",
            "Proses persetujuan memakan waktu karena harus menunggu antar divisi.",
            "Agenda Direksi dan catatan rapat belum terpusat di satu tempat.",
            "Belum ada pemantauan SLA yang jelas untuk setiap memorandum.",
            "CorpSec Bank Sumut butuh satu sistem digital yang rapi dan mudah dipakai.",
        ],
    )

    # 3 Apa itu sistem
    highlight_slide(
        prs, 3,
        "Apa Itu CorpSec Bank Sumut?",
        [
            ("8", "Modul\nOperasional"),
            ("7", "Tahap\nPersetujuan"),
            ("7", "Level\nPengguna"),
            ("1", "Platform\nTerpadu"),
        ],
    )

    # 4 Fitur utama
    two_col_slide(
        prs, 4,
        "Fitur Utama Sistem",
        "Yang Bisa Dilakukan CorpSec",
        [
            "Lihat ringkasan agenda & memorandum di dashboard",
            "Terima dan tinjau memorandum dari divisi",
            "Kelola jadwal kegiatan Direksi",
            "Pantau SLA dan laporan kinerja",
            "Cek berita dan regulasi terkait bank",
        ],
        "Yang Bisa Dilakukan Divisi Lain",
        [
            "Pengusul: kirim memorandum PDF",
            "Pimpinan Bidang: setujui atau tolak",
            "Sekretaris: teruskan ke Direksi/Komisaris",
            "Direksi & Komisaris: beri keputusan",
            "Semua pihak bisa cek status dokumen",
        ],
    )

    # 5 Modul
    table_slide(
        prs, 5,
        "Menu & Halaman Sistem",
        "Ringkasan modul yang tersedia di website",
        ["Menu", "Alamat", "Kegunaan"],
        [
            ["Dashboard", "/dashboard", "Ringkasan harian CorpSec"],
            ["Memorandum", "/dashboard/memorandum", "Upload & kelola memorandum"],
            ["Agenda", "/agenda", "Jadwal kegiatan Direksi"],
            ["Rapat", "/rapat", "Notulen & tindak lanjut"],
            ["Media", "/media", "Pantau berita & sentimen"],
            ["Knowledge", "/knowledge", "Arsip dokumen & regulasi"],
            ["SLA & Laporan", "/sla, /laporan", "Pantau target & statistik"],
        ],
    )

    # 6 Memorandum
    content_slide(
        prs, 6,
        "Modul Memorandum",
        "Dari upload PDF sampai keputusan akhir",
        [
            "Divisi mengunggah memorandum dalam bentuk PDF.",
            "CorpSec menerima dokumen, membaca isi, dan meninjau kelengkapan.",
            "Sistem membantu merangkum isi memorandum dan menandai hal penting.",
            "Setiap memorandum punya status: menunggu, sedang ditinjau, disetujui, atau ditolak.",
            "Dokumen yang belum dibaca ditandai agar tidak terlewat.",
            "Riwayat keputusan tersimpan sehingga bisa dicek kapan saja.",
        ],
    )

    # 7 Workflow
    content_slide(
        prs, 7,
        "Alur Persetujuan Memorandum",
        "7 tahap dari pengusul sampai keputusan akhir",
        [
            "1. Divisi Pengusul — mengirim memorandum",
            "2. Corporate Secretary — meninjau & menyiapkan dokumen",
            "3. Pemimpin Bidang — menyetujui atau menolak",
            "4. Sekretaris Direksi/Komisaris — meneruskan ke pimpinan",
            "5. Direksi atau Komisaris — memberi keputusan",
            "6. CorpSec — menyelesaikan proses sesuai keputusan",
            "7. Kembali ke Pengusul — pemberitahuan hasil akhir",
        ],
    )

    # 8 Role
    table_slide(
        prs, 8,
        "Siapa Saja Pengguna Sistem?",
        "Setiap role punya akses sesuai tugasnya",
        ["Peran", "Halaman Utama", "Tugas Utama"],
        [
            ["Divisi Pengusul", "/pengusul", "Kirim memorandum, lihat riwayat"],
            ["Corporate Secretary", "/dashboard", "Kelola seluruh proses CorpSec"],
            ["Pemimpin Bidang", "/pimpinan-bidang", "Tinjau & putuskan memorandum"],
            ["Sekretaris Direksi", "/sekdireksi", "Teruskan ke Direksi"],
            ["Sekretaris Komisaris", "/sekretaris-komisaris", "Teruskan ke Komisaris"],
            ["Direksi", "/direksi", "Berikan keputusan & tanda tangan"],
            ["Komisaris", "/komisaris", "Berikan keputusan"],
        ],
    )

    # 9 Demo
    table_slide(
        prs, 9,
        "Akun untuk Coba Sistem",
        "Gunakan akun berikut saat demo atau presentasi",
        ["Peran", "Username", "Password"],
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

    # 10 AI
    content_slide(
        prs, 10,
        "Bantuan Tinjauan Memorandum",
        "Fitur pendukung agar CorpSec lebih cepat bekerja",
        [
            "Saat PDF diunggah, sistem membaca isi dokumen secara otomatis.",
            "CorpSec mendapat ringkasan singkat isi memorandum.",
            "Sistem menandai poin penting dan hal yang perlu diperhatikan.",
            "Referensi regulasi yang relevan ditampilkan sebagai acuan.",
            "CorpSec tetap bisa mengubah ringkasan sebelum dokumen dilanjutkan.",
            "Tujuannya: mempercepat peninjauan, bukan menggantikan keputusan manusia.",
        ],
    )

    # 11 Modul lain
    two_col_slide(
        prs, 11,
        "Modul Pendukung Lainnya",
        "Agenda & Rapat",
        [
            "Buat jadwal kegiatan Direksi",
            "Catat lokasi, waktu, dan prioritas",
            "Simpan notulen rapat",
            "Pantau tindak lanjut beserta penanggung jawab",
        ],
        "Media & Arsip Dokumen",
        [
            "Pantau berita seputar Bank Sumut",
            "Lihat sentimen berita: positif, netral, negatif",
            "Simpan SK, SE, SOP, dan regulasi",
            "Jadi acuan saat meninjau memorandum",
        ],
    )

    # 12 KPI
    table_slide(
        prs, 12,
        "Target Kinerja Sistem",
        "Indikator yang dipantau sesuai kebutuhan CorpSec",
        ["Indikator", "Target", "Keterangan"],
        [
            ["Waktu tinjauan memorandum", "< 5 menit", "Proses baca & rangkum dokumen"],
            ["Proses persetujuan", "Lebih cepat", "Alur digital, tidak lewat kertas"],
            ["Penggunaan kertas", "Berkurang", "Semua lewat upload PDF"],
            ["Agenda Direksi", "Tercatat", "Semua jadwal masuk sistem"],
            ["SLA memorandum", "≥ 95%", "Dipantau di menu SLA"],
            ["Keterlambatan", "Minim", "Ada peringatan jika melewati batas waktu"],
        ],
    )

    # 13 Tampilan
    content_slide(
        prs, 13,
        "Tampilan Website",
        "Desain mengikuti identitas Bank Sumut",
        [
            "Warna utama: biru navy dan oranye sesuai branding Bank Sumut.",
            "Tampilan bersih, enak dibaca, dan mudah dinavigasi.",
            "Halaman login menampilkan gambar gedung Bank Sumut.",
            "Dashboard dilengkapi banner dan ringkasan informasi penting.",
            "Setiap role melihat menu yang sesuai dengan tugasnya.",
            "Bisa diakses lewat laptop maupun layar yang lebih kecil.",
        ],
    )

    # 14 Tech (simple, not jargon-heavy)
    content_slide(
        prs, 14,
        "Teknologi yang Digunakan",
        "Dasar pembangunan sistem",
        [
            "Website dibangun dengan Next.js — framework web modern.",
            "Data disimpan di database SQLite, cukup untuk kebutuhan demo.",
            "Tampilan dibuat dengan Tailwind CSS, mengikuti warna Bank Sumut.",
            "Grafik di dashboard menggunakan Recharts.",
            "File memorandum disimpan dalam format PDF.",
            "Sistem login dengan pembagian akses per role.",
        ],
    )

    # 15 Closing
    closing_slide(prs, 15)

    return prs


def main():
    prs = build()
    prs.save(str(OUTPUT))
    # Also save copy in docs/
    docs_copy = OUTPUT.parent / "docs" / "CorpSec-Bank-Sumut-Presentasi.pptx"
    docs_copy.parent.mkdir(exist_ok=True)
    prs.save(str(docs_copy))
    print(f"Saved: {OUTPUT}")
    print(f"Slides: {len(prs.slides)}")


if __name__ == "__main__":
    main()
