import { AppShell } from "@/components/layout/AppShell";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DireksiLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "direksi") redirect("/login");
  return <AppShell session={session}>{children}</AppShell>;
}
