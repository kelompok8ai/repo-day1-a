import type { UserRole } from "./db/schema";

export const ROLE_LABELS: Record<UserRole, string> = {
  pengusul: "Divisi Pengusul",
  corpsec: "Corporate Secretary",
  pimpinan_bidang: "Pemimpin Bidang",
  sekdireksi: "Sekretaris Direksi",
  sekretaris_komisaris: "Sekretaris Komisaris",
  direksi: "Direksi",
  komisaris: "Komisaris",
};

export const ROLE_HOME: Record<UserRole, string> = {
  pengusul: "/pengusul",
  corpsec: "/dashboard",
  pimpinan_bidang: "/pimpinan-bidang",
  sekdireksi: "/sekdireksi",
  sekretaris_komisaris: "/sekretaris-komisaris",
  direksi: "/direksi",
  komisaris: "/komisaris",
};

export type NavItem = {
  href: string;
  label: string;
  icon: string;
};

export const NAV_BY_ROLE: Record<UserRole, NavItem[]> = {
  pengusul: [
    { href: "/pengusul", label: "Beranda", icon: "LayoutDashboard" },
    { href: "/pengusul/kirim", label: "Kirim Memorandum", icon: "Upload" },
    { href: "/pengusul/riwayat", label: "Riwayat & Keputusan", icon: "FileText" },
  ],
  corpsec: [
    { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
    { href: "/dashboard/memorandum", label: "Memorandum", icon: "FileText" },
    { href: "/dashboard/memorandum/new", label: "Buat Memorandum", icon: "Plus" },
    { href: "/agenda", label: "Agenda Direksi", icon: "Calendar" },
    { href: "/knowledge", label: "Knowledge Base", icon: "BookOpen" },
    { href: "/sla", label: "SLA Monitoring", icon: "Clock" },
    { href: "/laporan", label: "Laporan", icon: "BarChart3" },
  ],
  pimpinan_bidang: [
    { href: "/pimpinan-bidang", label: "Review Memorandum", icon: "UserCheck" },
  ],
  sekdireksi: [
    { href: "/sekdireksi", label: "Inbox Direksi", icon: "Inbox" },
  ],
  sekretaris_komisaris: [
    { href: "/sekretaris-komisaris", label: "Inbox Komisaris", icon: "Inbox" },
  ],
  direksi: [
    { href: "/direksi", label: "Memorandum Direksi", icon: "Gavel" },
  ],
  komisaris: [
    { href: "/komisaris", label: "Memorandum Komisaris", icon: "Gavel" },
  ],
};

const CORPSEC_ROUTES = ["/dashboard", "/agenda", "/rapat", "/media", "/knowledge", "/sla", "/laporan"];

export function canAccessRoute(role: UserRole, pathname: string): boolean {
  if (pathname === "/login" || pathname.startsWith("/api/auth")) return true;
  if (pathname.startsWith("/api/")) return true;

  switch (role) {
    case "pengusul":
      return pathname.startsWith("/pengusul");
    case "pimpinan_bidang":
      return pathname.startsWith("/pimpinan-bidang");
    case "corpsec":
      return CORPSEC_ROUTES.some((r) => pathname === r || pathname.startsWith(`${r}/`));
    case "sekdireksi":
      return pathname.startsWith("/sekdireksi");
    case "sekretaris_komisaris":
      return pathname.startsWith("/sekretaris-komisaris");
    case "direksi":
      return pathname.startsWith("/direksi");
    case "komisaris":
      return pathname.startsWith("/komisaris");
    default:
      return false;
  }
}

export const DEMO_CREDENTIALS = [
  { role: "Divisi Pengusul", username: "pengusul", password: "pengusul123" },
  { role: "Corporate Secretary", username: "corpsec", password: "corpsec123" },
  { role: "Pemimpin Bidang", username: "pimpinan", password: "pimpinan123" },
  { role: "Sekretaris Direksi", username: "sekdireksi", password: "sekdireksi123" },
  { role: "Sekretaris Komisaris", username: "sekkom", password: "sekkom123" },
  { role: "Direktur Utama", username: "dirut", password: "dirut123" },
  { role: "Direktur IT", username: "dir_it", password: "dirit123" },
  { role: "Komisaris Utama", username: "kom_utama", password: "kom123" },
];
