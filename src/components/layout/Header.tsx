import type { SessionUser } from "@/lib/auth";
import { ROLE_LABELS } from "@/lib/roles";

export function Header({
  title,
  subtitle,
  session,
}: {
  title: string;
  subtitle?: string;
  session?: SessionUser;
}) {
  return (
    <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-4 px-6 py-4">
        <div className="pl-10 lg:pl-0">
          <div className="mb-1 h-0.5 w-10 rounded-full bg-brand-500" />
          <h1 className="text-xl font-bold text-navy-900">{title}</h1>
          {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
        </div>
        {session && (
          <div className="hidden rounded-xl border border-slate-200 bg-gradient-to-br from-white to-slate-50 px-4 py-2.5 sm:block">
            <p className="text-xs font-semibold text-navy-900">{session.name}</p>
            <p className="text-[11px] text-brand-600">{ROLE_LABELS[session.role]}</p>
          </div>
        )}
      </div>
    </header>
  );
}
