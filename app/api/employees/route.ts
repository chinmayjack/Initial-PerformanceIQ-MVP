import { NextRequest, NextResponse } from "next/server";
import { createEmployee, getCurrentOrganization, getCurrentUser, getEmployees, getVisibleEmployees } from "@/lib/data";
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

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const employee = await createEmployee({
      name: body.name,
      email: body.email,
      title: body.title,
      departmentId: body.departmentId,
      managerId: body.managerId || undefined,
      currentLevel: body.currentLevel,
      careerAspirations: body.careerAspirations,
      joiningDate: body.joiningDate
    });
    return NextResponse.json({ employee }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to add employee" }, { status: 400 });
  }
}
