export const MEMORANDUM_STATUS: Record<string, { label: string; color: string }> = {
  uploaded: { label: "Diterima dari Pengusul", color: "bg-slate-100 text-slate-700" },
  draft: { label: "Draft", color: "bg-slate-100 text-slate-700" },
  ai_review: { label: "Analisa AI", color: "bg-purple-100 text-purple-700" },
  corpsec_review: { label: "Review CorpSec", color: "bg-indigo-100 text-indigo-700" },
  pimpinan_review: { label: "Review Pimpinan Bidang", color: "bg-amber-100 text-amber-800" },
  pending_approval: { label: "Review Pimpinan Bidang", color: "bg-amber-100 text-amber-800" },
  returned_to_corpsec: { label: "Keputusan Pimpinan Bidang", color: "bg-orange-100 text-orange-800" },
  sent_to_sekdireksi: { label: "Dikirim ke Sekretaris Direksi", color: "bg-blue-100 text-blue-800" },
  received_sekdireksi: { label: "Diterima Sekretaris Direksi", color: "bg-sky-100 text-sky-800" },
  sent_to_sekkom: { label: "Dikirim ke Sekretaris Komisaris", color: "bg-violet-100 text-violet-800" },
  received_sekkom: { label: "Diterima Sekretaris Komisaris", color: "bg-violet-100 text-violet-700" },
  board_review: { label: "Review Direksi/Komisaris", color: "bg-amber-100 text-amber-900" },
  returned_to_corpsec_board: { label: "Keputusan Board ke CorpSec", color: "bg-orange-100 text-orange-900" },
  returned_to_pengusul: { label: "Dikembalikan ke Pengusul", color: "bg-rose-100 text-rose-800" },
  completed: { label: "Selesai", color: "bg-brand-100 text-navy-800" },
  approved: { label: "Disetujui", color: "bg-brand-100 text-navy-800" },
  rejected: { label: "Ditolak", color: "bg-red-100 text-red-700" },
  signed: { label: "Ditandatangani", color: "bg-blue-100 text-blue-800" },
};

export const WORKFLOW_STEPS = [
  { key: "upload", label: "Divisi Pengusul", statuses: ["uploaded", "draft"] },
  { key: "corpsec", label: "Corporate Secretary (AI Review)", statuses: ["ai_review", "corpsec_review"] },
  { key: "pimpinan", label: "Pemimpin Bidang", statuses: ["pimpinan_review", "pending_approval", "returned_to_corpsec"] },
  { key: "sekretariat", label: "Sekretaris Direksi / Komisaris", statuses: ["sent_to_sekdireksi", "received_sekdireksi", "sent_to_sekkom", "received_sekkom"] },
  { key: "board", label: "Direksi / Komisaris", statuses: ["board_review"] },
  { key: "corpsec_final", label: "CorpSec (Keputusan Board)", statuses: ["returned_to_corpsec_board"] },
  { key: "pengusul_final", label: "Kembali ke Pengusul", statuses: ["returned_to_pengusul", "completed"] },
] as const;

export const URGENCY: Record<string, { label: string; color: string }> = {
  low: { label: "Rendah", color: "bg-slate-100 text-slate-600" },
  normal: { label: "Normal", color: "bg-blue-100 text-blue-700" },
  high: { label: "Tinggi", color: "bg-red-100 text-red-700" },
};

export const SLA_STATUS: Record<string, { label: string; color: string }> = {
  on_track: { label: "On Track", color: "bg-brand-100 text-brand-600" },
  at_risk: { label: "Berisiko", color: "bg-amber-100 text-amber-700" },
  breached: { label: "Terlambat", color: "bg-red-100 text-red-700" },
};

export const SENTIMENT: Record<string, { label: string; color: string }> = {
  positive: { label: "Positif", color: "text-brand-600" },
  neutral: { label: "Netral", color: "text-slate-600" },
  negative: { label: "Negatif", color: "text-red-600" },
};

export const APP_NAME = "CorpSec Bank Sumut";
