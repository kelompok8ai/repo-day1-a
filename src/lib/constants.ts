export const MEMORANDUM_STATUS: Record<string, { label: string; color: string }> = {
  uploaded: { label: "File Diupload", color: "bg-slate-100 text-slate-700" },
  draft: { label: "Draft", color: "bg-slate-100 text-slate-700" },
  ai_review: { label: "Analisa AI", color: "bg-purple-100 text-purple-700" },
  corpsec_review: { label: "Review CorpSec", color: "bg-indigo-100 text-indigo-700" },
  pimpinan_review: { label: "Review Pimpinan Bidang", color: "bg-amber-100 text-amber-800" },
  pending_approval: { label: "Review Pimpinan Bidang", color: "bg-amber-100 text-amber-800" },
  returned_to_corpsec: { label: "Kembali ke CorpSec", color: "bg-orange-100 text-orange-800" },
  approved: { label: "Disetujui", color: "bg-emerald-100 text-emerald-800" },
  rejected: { label: "Ditolak", color: "bg-red-100 text-red-700" },
  signed: { label: "Ditandatangani", color: "bg-blue-100 text-blue-800" },
};

export const WORKFLOW_STEPS = [
  { key: "upload", label: "Upload File Memorandum", statuses: ["uploaded"] },
  { key: "ai", label: "Analisa AI (SMD + Regulasi)", statuses: ["ai_review"] },
  { key: "corpsec", label: "Review & Edit CorpSec", statuses: ["corpsec_review", "returned_to_corpsec"] },
  { key: "pimpinan", label: "Pimpinan Bidang", statuses: ["pimpinan_review", "pending_approval"] },
  { key: "done", label: "Selesai / Arsip", statuses: ["approved", "signed", "rejected"] },
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

export const NAV_ITEMS = [
  { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
  { href: "/agenda", label: "Agenda Direksi", icon: "Calendar" },
  { href: "/memorandum", label: "Memorandum", icon: "FileText" },
  { href: "/pimpinan-bidang", label: "Pimpinan Bidang", icon: "UserCheck" },
  { href: "/rapat", label: "Rapat", icon: "Users" },
  { href: "/media", label: "Media Monitoring", icon: "Newspaper" },
  { href: "/knowledge", label: "Knowledge Base", icon: "BookOpen" },
  { href: "/sla", label: "SLA Monitoring", icon: "Clock" },
  { href: "/laporan", label: "Laporan", icon: "BarChart3" },
] as const;

export const APP_NAME = "CorpSec Bank Sumut";
