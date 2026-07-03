import { AppShell } from "@/components/layout/AppShell";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function KomisarisLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "komisaris") redirect("/login");
  return <AppShell session={session}>{children}</AppShell>;
}
