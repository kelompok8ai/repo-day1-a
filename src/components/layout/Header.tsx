import { Bell, Search, User } from "lucide-react";

export function Header({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <header className="border-b border-slate-200 bg-white px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="pl-10 lg:pl-0">
          <h1 className="text-xl font-bold text-slate-900">{title}</h1>
          {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
        </div>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 md:flex">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              type="search"
              placeholder="Cari memorandum, agenda..."
              className="w-48 bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </div>
          <button
            type="button"
            className="relative rounded-lg border border-slate-200 p-2 hover:bg-slate-50"
            aria-label="Notifikasi"
          >
            <Bell className="h-4 w-4 text-slate-600" />
            <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-red-500" />
          </button>
          <div className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2">
            <div className="rounded-full bg-emerald-100 p-1">
              <User className="h-4 w-4 text-emerald-700" />
            </div>
            <div className="hidden sm:block">
              <p className="text-xs font-medium text-slate-900">Drs. Ahmad Wijaya</p>
              <p className="text-xs text-slate-500">Direksi</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
