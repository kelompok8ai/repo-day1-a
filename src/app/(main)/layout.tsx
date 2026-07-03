import { AppShell } from "@/components/layout/AppShell";
import { getSession } from "@/lib/auth";
import { ROLE_HOME } from "@/lib/roles";
import { redirect } from "next/navigation";

export default async function MainLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "corpsec" && session.role !== "pimpinan_bidang") {
    redirect(ROLE_HOME[session.role]);
  }
  return <AppShell session={session}>{children}</AppShell>;
}
