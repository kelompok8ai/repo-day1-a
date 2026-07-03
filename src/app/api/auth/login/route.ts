import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { authenticateUser } from "@/lib/db/queries";
import { SESSION_COOKIE, serializeSession } from "@/lib/auth";
import { ROLE_HOME } from "@/lib/roles";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const { username, password } = await request.json();
  const user = authenticateUser(username, password);
  if (!user) {
    return NextResponse.json({ error: "Username atau password salah" }, { status: 401 });
  }

  const session = {
    id: user.id,
    name: user.name,
    username: user.username,
    role: user.role as "pengusul" | "pimpinan_bidang" | "corpsec" | "sekdireksi",
    divisi: user.divisi,
  };

  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, serializeSession(session), {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });

  return NextResponse.json({ home: ROLE_HOME[session.role], user: session });
}
