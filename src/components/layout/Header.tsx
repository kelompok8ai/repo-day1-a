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
    <header className="border-b border-slate-200 bg-white px-6 py-4">
      <div className="flex items-center justify-between gap-4">
        <div className="pl-10 lg:pl-0">
          <h1 className="text-xl font-bold text-slate-900">{title}</h1>
          {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
        </div>
        {session && (
          <div className="hidden rounded-lg border border-slate-200 px-3 py-2 sm:block">
            <p className="text-xs font-medium text-slate-900">{session.name}</p>
            <p className="text-xs text-slate-500">{ROLE_LABELS[session.role]}</p>
          </div>
        )}
      </div>
    </header>
  );
}
