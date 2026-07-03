import { AppShell } from "@/components/layout/AppShell";
import { getSession } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function SekdireksiLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (session.role !== "sekdireksi") redirect("/login");
  return <AppShell session={session}>{children}</AppShell>;
}
