"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
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
} from "lucide-react";
import { useState } from "react";
import { APP_NAME, NAV_ITEMS } from "@/lib/constants";
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
};

export function Sidebar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

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
              <p className="text-xs text-emerald-300">Corporate Secretary</p>
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
            {NAV_ITEMS.map((item) => {
              const Icon = iconMap[item.icon];
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
          <p className="text-xs text-emerald-300">Bank Sumut</p>
          <p className="text-xs text-emerald-400">Draft v0.1 — PRD Discovery</p>
        </div>
      </aside>
    </>
  );
}
