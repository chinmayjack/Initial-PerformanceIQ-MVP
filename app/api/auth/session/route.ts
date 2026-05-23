import { NextResponse } from "next/server";
import { getSessionContext } from "@/lib/session";

export const dynamic = "force-dynamic";

export async function GET() {
  const session = getSessionContext();
  return NextResponse.json({
    authenticated: Boolean(session.organizationSlug && session.userEmail),
    organizationSlug: session.organizationSlug,
    userEmail: session.userEmail,
    userName: session.userName,
    userRole: session.userRole
  });
}
