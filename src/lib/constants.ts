export const MEMORANDUM_STATUS: Record<string, { label: string; color: string }> = {
  uploaded: { label: "Diterima dari Pengusul", color: "bg-slate-100 text-slate-700" },
  draft: { label: "Draft", color: "bg-slate-100 text-slate-700" },
  ai_review: { label: "Analisa AI", color: "bg-purple-100 text-purple-700" },
  corpsec_review: { label: "Review CorpSec", color: "bg-indigo-100 text-indigo-700" },
  pimpinan_review: { label: "Review Pimpinan Bidang", color: "bg-amber-100 text-amber-800" },
  pending_approval: { label: "Review Pimpinan Bidang", color: "bg-amber-100 text-amber-800" },
  returned_to_corpsec: { label: "Keputusan Pimpinan Bidang", color: "bg-orange-100 text-orange-800" },
  sent_to_sekdireksi: { label: "Dikirim ke Sekdireksi", color: "bg-blue-100 text-blue-800" },
  received_sekdireksi: { label: "Diterima Sekdireksi", color: "bg-emerald-100 text-emerald-800" },
  approved: { label: "Disetujui", color: "bg-emerald-100 text-emerald-800" },
  rejected: { label: "Ditolak", color: "bg-red-100 text-red-700" },
  signed: { label: "Ditandatangani", color: "bg-blue-100 text-blue-800" },
};

export const WORKFLOW_STEPS = [
  { key: "upload", label: "Upload dari Divisi Pengusul", statuses: ["uploaded"] },
  { key: "ai", label: "Analisa AI (SMD + Regulasi)", statuses: ["ai_review"] },
  { key: "corpsec", label: "Review & Edit CorpSec", statuses: ["corpsec_review"] },
  { key: "pimpinan", label: "Pimpinan Bidang", statuses: ["pimpinan_review", "pending_approval"] },
  { key: "return", label: "Keputusan ke CorpSec", statuses: ["returned_to_corpsec"] },
  { key: "sekdireksi", label: "Sekretaris Direksi", statuses: ["sent_to_sekdireksi", "received_sekdireksi"] },
] as const;

export const URGENCY: Record<string, { label: string; color: string }> = {
  low: { label: "Rendah", color: "bg-slate-100 text-slate-600" },
  normal: { label: "Normal", color: "bg-blue-100 text-blue-700" },
  high: { label: "Tinggi", color: "bg-red-100 text-red-700" },
};

export const SLA_STATUS: Record<string, { label: string; color: string }> = {
  on_track: { label: "On Track", color: "bg-emerald-100 text-emerald-700" },
  at_risk: { label: "Berisiko", color: "bg-amber-100 text-amber-700" },
  breached: { label: "Terlambat", color: "bg-red-100 text-red-700" },
};

export const SENTIMENT: Record<string, { label: string; color: string }> = {
  positive: { label: "Positif", color: "text-emerald-600" },
  neutral: { label: "Netral", color: "text-slate-600" },
  negative: { label: "Negatif", color: "text-red-600" },
};

export const APP_NAME = "CorpSec Bank Sumut";
