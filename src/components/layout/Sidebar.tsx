"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Calendar,
  FileText,
  Users,
  Newspaper,
  BookOpen,
  Clock,
  BarChart3,
  Menu,
  X,
  UserCheck,
  Upload,
  Plus,
  Inbox,
  Gavel,
  LogOut,
} from "lucide-react";
import { useState } from "react";
import { APP_NAME } from "@/lib/constants";
import { NAV_BY_ROLE, ROLE_LABELS } from "@/lib/roles";
import type { SessionUser } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { BankLogo } from "@/components/brand/BankLogo";
import { BRAND } from "@/lib/brand";

const iconMap = {
  LayoutDashboard,
  Calendar,
  FileText,
  Users,
  Newspaper,
  BookOpen,
  Clock,
  BarChart3,
  UserCheck,
  Upload,
  Plus,
  Inbox,
  Gavel,
};

export function Sidebar({ session }: { session: SessionUser }) {
  const pathname = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const navItems = NAV_BY_ROLE[session.role];

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed left-4 top-4 z-50 rounded-lg bg-navy-900 p-2.5 text-white shadow-lg lg:hidden"
        aria-label="Buka menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-navy-950/60 backdrop-blur-sm lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-navy-900 text-white shadow-xl transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        {/* Brand header */}
        <div className="border-b border-navy-800 px-5 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BankLogo size={40} />
              <div>
                <p className="text-sm font-bold leading-tight">{BRAND.name}</p>
                <p className="text-[10px] uppercase tracking-wider text-brand-400">CorpSec</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="rounded p-1 hover:bg-navy-800 lg:hidden"
              aria-label="Tutup menu"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="mt-3 h-0.5 w-full rounded-full bg-navy-800">
            <div className="h-full w-1/3 rounded-full bg-brand-500" />
          </div>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-wider text-navy-400">
            {ROLE_LABELS[session.role]}
          </p>
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap];
              const active =
                pathname === item.href ||
                pathname.startsWith(`${item.href}/`) ||
                (item.href.includes("#") && pathname === item.href.split("#")[0]);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all",
                      active
                        ? "bg-brand-500 text-white shadow-md shadow-brand-500/30"
                        : "text-slate-300 hover:bg-navy-800 hover:text-white"
                    )}
                  >
                    <Icon className="h-4 w-4 shrink-0" />
                    {item.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-navy-800 px-5 py-4">
          <div className="rounded-lg bg-navy-800/60 p-3">
            <p className="text-xs font-semibold text-white">{session.name}</p>
            <p className="text-[11px] text-brand-300">@{session.username}</p>
            {session.divisi && (
              <p className="mt-0.5 text-[11px] text-slate-400">{session.divisi}</p>
            )}
          </div>
          <button
            type="button"
            onClick={logout}
            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg border border-navy-700 px-3 py-2 text-xs text-slate-300 transition hover:border-brand-500 hover:text-brand-400"
          >
            <LogOut className="h-3.5 w-3.5" />
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
}
