import { cookies } from "next/headers";
import type { UserRole } from "./db/schema";

export const SESSION_COOKIE = "corpsec_session";

export type SessionUser = {
  id: number;
  name: string;
  username: string;
  role: UserRole;
  divisi: string | null;
  boardPosition?: string | null;
};

export async function getSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export function serializeSession(user: SessionUser) {
  return JSON.stringify(user);
}

export async function requireSession(): Promise<SessionUser> {
  const session = await getSession();
  if (!session) throw new Error("Unauthorized");
  return session;
}

export async function requireRole(...roles: UserRole[]): Promise<SessionUser> {
  const session = await requireSession();
  if (!roles.includes(session.role)) throw new Error("Forbidden");
  return session;
}
