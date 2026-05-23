import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sessionCookieNames } from "@/lib/session-config";

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: 60 * 60 * 24 * 7
};

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const organizationSlug = String(formData.get("organizationSlug") ?? "");
  const userEmail = String(formData.get("userEmail") ?? "");

  const organization = await prisma.organization.findUnique({
    where: { slug: organizationSlug },
    include: {
      users: {
        where: { email: userEmail },
        take: 1
      }
    }
  });

  const user = organization?.users[0];
  if (!organization || !user) {
    return NextResponse.redirect(new URL("/login?error=invalid-session", request.url));
  }

  const response = NextResponse.redirect(new URL("/dashboard", request.url));
  response.cookies.set(sessionCookieNames.organizationSlug, organization.slug, cookieOptions);
  response.cookies.set(sessionCookieNames.userEmail, user.email, cookieOptions);
  response.cookies.set(sessionCookieNames.userName, user.name, cookieOptions);
  response.cookies.set(sessionCookieNames.userRole, user.role, cookieOptions);
  return response;
}
