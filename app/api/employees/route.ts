import { NextRequest, NextResponse } from "next/server";
import { getMockSession } from "@/lib/auth";
import { getCurrentOrganization, getEmployees, getVisibleEmployees } from "@/lib/data";
import { Role } from "@/lib/types";

export async function GET(request: NextRequest) {
  const role = request.nextUrl.searchParams.get("role") as Role | null;
  const session = getMockSession(role ?? undefined);
  const organization = await getCurrentOrganization();
  const employees = await getEmployees();
  if (session.user.role === "EXECUTIVE") {
    return NextResponse.json({
      organization,
      employees: [],
      aggregate: {
        totalEmployees: employees.length,
        averagePerformance: Math.round(employees.reduce((sum, employee) => sum + employee.performanceScore, 0) / employees.length)
      }
    });
  }
  return NextResponse.json({ organization, employees: await getVisibleEmployees(session.user.role, session.user.id) });
}
