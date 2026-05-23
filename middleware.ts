import { NextRequest, NextResponse } from "next/server";
import { sessionCookieNames } from "@/lib/session-config";

const publicPaths = ["/", "/login", "/api/health"];

function isPublicPath(pathname: string) {
  return publicPaths.includes(pathname) || pathname.startsWith("/api/auth") || pathname.startsWith("/_next") || pathname.startsWith("/favicon");
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (isPublicPath(pathname)) {
    return NextResponse.next();
  }

  const hasSession = Boolean(request.cookies.get(sessionCookieNames.organizationSlug)?.value && request.cookies.get(sessionCookieNames.userEmail)?.value);
  if (hasSession) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/api")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\..*).*)"]
};
