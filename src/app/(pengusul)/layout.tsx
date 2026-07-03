import { AppShell } from "@/components/layout/AppShell";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function PengusulLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "pengusul") redirect("/login");
  return <AppShell session={session}>{children}</AppShell>;
}
