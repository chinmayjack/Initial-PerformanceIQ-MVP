import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

function envStatus(name: string) {
  const value = process.env[name];
  return {
    name,
    present: Boolean(value),
    length: value?.length ?? 0
  };
}

export async function GET() {
  const env = ["DATABASE_URL", "DIRECT_URL", "OPENAI_API_KEY", "OPENAI_REVIEW_MODEL", "NEXT_PUBLIC_APP_URL"].map(envStatus);

  try {
    const [organizations, users, employees, goals] = await Promise.all([
      prisma.organization.count(),
      prisma.user.count(),
      prisma.employeeProfile.count(),
      prisma.goal.count()
    ]);

    return NextResponse.json({
      ok: true,
      env,
      database: {
        connected: true,
        organizations,
        users,
        employees,
        goals
      }
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        env,
        database: {
          connected: false,
          error: error instanceof Error ? error.message : "Unknown database error"
        }
      },
      { status: 500 }
    );
  }
}
