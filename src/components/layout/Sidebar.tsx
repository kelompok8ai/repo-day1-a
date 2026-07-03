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
  Building2,
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
        className="fixed left-4 top-4 z-50 rounded-lg bg-emerald-700 p-2 text-white shadow-lg lg:hidden"
        aria-label="Buka menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/40 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-64 flex-col bg-emerald-900 text-white transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between border-b border-emerald-800 px-5 py-5">
          <div className="flex items-center gap-3">
            <div className="rounded-lg bg-white/10 p-2">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-bold leading-tight">{APP_NAME}</p>
              <p className="text-xs text-emerald-300">{ROLE_LABELS[session.role]}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setOpen(false)}
            className="rounded p-1 hover:bg-emerald-800 lg:hidden"
            aria-label="Tutup menu"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => {
              const Icon = iconMap[item.icon as keyof typeof iconMap];
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    onClick={() => setOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      active
                        ? "bg-white text-emerald-900"
                        : "text-emerald-100 hover:bg-emerald-800 hover:text-white"
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

        <div className="border-t border-emerald-800 px-5 py-4">
          <p className="text-xs font-medium text-white">{session.name}</p>
          <p className="text-xs text-emerald-400">@{session.username}</p>
          {session.divisi && (
            <p className="mt-1 text-xs text-emerald-300">{session.divisi}</p>
          )}
          <button
            type="button"
            onClick={logout}
            className="mt-3 flex w-full items-center gap-2 rounded-lg px-2 py-1.5 text-xs text-emerald-200 hover:bg-emerald-800"
          >
            <LogOut className="h-3.5 w-3.5" />
            Keluar
          </button>
        </div>
      </aside>
    </>
  );
}
