import type { SessionUser } from "@/lib/auth";
import { Sidebar } from "./Sidebar";

export function AppShell({
  session,
  children,
}: {
  session: SessionUser;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar session={session} />
      <main className="flex-1 overflow-x-hidden">{children}</main>
    </div>
  );
}
