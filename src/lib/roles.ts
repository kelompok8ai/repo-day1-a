export type UserRole = "pengusul" | "pimpinan_bidang" | "corpsec" | "sekdireksi";

export const ROLE_LABELS: Record<UserRole, string> = {
  pengusul: "Divisi Pengusul",
  pimpinan_bidang: "Pemimpin Bidang",
  corpsec: "Corporate Secretary",
  sekdireksi: "Sekretaris Direksi",
};

export const ROLE_HOME: Record<UserRole, string> = {
  pengusul: "/pengusul",
  pimpinan_bidang: "/pimpinan-bidang",
  corpsec: "/dashboard",
  sekdireksi: "/sekdireksi",
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
    { href: "/pengusul/riwayat", label: "Riwayat Pengiriman", icon: "FileText" },
  ],
  pimpinan_bidang: [
    { href: "/pimpinan-bidang", label: "Review Memorandum", icon: "UserCheck" },
  ],
  corpsec: [
    { href: "/dashboard", label: "Dashboard", icon: "LayoutDashboard" },
    { href: "/memorandum", label: "Memorandum", icon: "FileText" },
    { href: "/memorandum/baru", label: "Upload Memorandum", icon: "Upload" },
    { href: "/agenda", label: "Agenda Direksi", icon: "Calendar" },
    { href: "/agenda/baru", label: "Buat Jadwal Agenda", icon: "Plus" },
    { href: "/rapat", label: "Rapat", icon: "Users" },
    { href: "/media", label: "Media Monitoring", icon: "Newspaper" },
    { href: "/knowledge", label: "Knowledge Base", icon: "BookOpen" },
    { href: "/sla", label: "SLA Monitoring", icon: "Clock" },
    { href: "/laporan", label: "Laporan", icon: "BarChart3" },
  ],
  sekdireksi: [
    { href: "/sekdireksi", label: "Dokumen Diterima", icon: "Inbox" },
  ],
};

const CORPSEC_ROUTES = [
  "/dashboard",
  "/memorandum",
  "/agenda",
  "/rapat",
  "/media",
  "/knowledge",
  "/sla",
  "/laporan",
];

export function canAccessRoute(role: UserRole, pathname: string): boolean {
  if (pathname === "/login" || pathname.startsWith("/api/auth")) return true;

  switch (role) {
    case "pengusul":
      return pathname.startsWith("/pengusul");
    case "pimpinan_bidang":
      return (
        pathname.startsWith("/pimpinan-bidang") ||
        (pathname.startsWith("/memorandum/") && pathname !== "/memorandum/baru")
      );
    case "corpsec":
      return CORPSEC_ROUTES.some(
        (r) => pathname === r || pathname.startsWith(`${r}/`)
      );
    case "sekdireksi":
      return pathname.startsWith("/sekdireksi");
    default:
      return false;
  }
}

export const DEMO_CREDENTIALS = [
  { role: "Divisi Pengusul", username: "pengusul", password: "pengusul123" },
  { role: "Pemimpin Bidang", username: "pimpinan", password: "pimpinan123" },
  { role: "Corporate Secretary", username: "corpsec", password: "corpsec123" },
  { role: "Sekretaris Direksi", username: "sekdireksi", password: "sekdireksi123" },
];
