import { NextRequest, NextResponse } from "next/server";
import { getCurrentOrganization, getCurrentUser, getEmployees, getVisibleEmployees } from "@/lib/data";
import { Role } from "@/lib/types";

export async function GET(request: NextRequest) {
  const role = request.nextUrl.searchParams.get("role") as Role | null;
  const currentUser = await getCurrentUser();
  const activeRole = role ?? currentUser.role;
  const organization = await getCurrentOrganization();
  const employees = await getEmployees();
  if (activeRole === "EXECUTIVE") {
    return NextResponse.json({
      organization,
      employees: [],
      aggregate: {
        totalEmployees: employees.length,
        averagePerformance: Math.round(employees.reduce((sum, employee) => sum + employee.performanceScore, 0) / employees.length)
      }
    });
  }
  return NextResponse.json({ organization, employees: await getVisibleEmployees(activeRole, currentUser.id) });
}
