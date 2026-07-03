import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { SESSION_COOKIE, type SessionUser } from "@/lib/auth";
import type { UserRole } from "@/lib/db/schema";

export async function getApiSession(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SESSION_COOKIE)?.value;
  if (!raw) return null;
  try {
    return JSON.parse(raw) as SessionUser;
  } catch {
    return null;
  }
}

export async function requireApiSession(): Promise<SessionUser | NextResponse> {
  const session = await getApiSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return session;
}

export async function requireApiRole(
  ...roles: UserRole[]
): Promise<SessionUser | NextResponse> {
  const session = await requireApiSession();
  if (session instanceof NextResponse) return session;
  if (!roles.includes(session.role)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  return session;
}

export function isErrorResponse(v: unknown): v is NextResponse {
  return v instanceof NextResponse;
}
