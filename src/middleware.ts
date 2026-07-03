import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { SESSION_COOKIE } from "@/lib/auth";
import type { UserRole } from "@/lib/db/schema";
import { canAccessRoute, ROLE_HOME } from "@/lib/roles";

const PUBLIC_PATHS = ["/login", "/api/auth/login", "/api/auth/logout"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    PUBLIC_PATHS.some((p) => pathname === p || pathname.startsWith(p)) ||
    pathname.startsWith("/_next") ||
    pathname.startsWith("/favicon")
  ) {
    return NextResponse.next();
  }

  const sessionRaw = request.cookies.get(SESSION_COOKIE)?.value;
  if (!sessionRaw) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  let session: { role: UserRole };
  try {
    session = JSON.parse(sessionRaw);
  } catch {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname === "/") {
    return NextResponse.redirect(new URL(ROLE_HOME[session.role], request.url));
  }

  if (!canAccessRoute(session.role, pathname)) {
    return NextResponse.redirect(new URL(ROLE_HOME[session.role], request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|.*\\..*).*)"],
};
