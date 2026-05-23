import { NextRequest, NextResponse } from "next/server";
import { sessionCookieNames } from "@/lib/session-config";

export async function GET(request: NextRequest) {
  const response = NextResponse.redirect(new URL("/login", request.url));
  Object.values(sessionCookieNames).forEach((name) => response.cookies.delete(name));
  return response;
}
