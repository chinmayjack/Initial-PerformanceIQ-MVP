import { NextRequest, NextResponse } from "next/server";
import { getMockSession } from "@/lib/auth";
import { canViewEmployee, createGoal, getEmployee, getVisibleEmployees } from "@/lib/data";

export async function GET(request: NextRequest) {
  const employeeId = request.nextUrl.searchParams.get("employeeId");
  const session = getMockSession();
  let employees = await getVisibleEmployees(session.user.role, session.user.id);
  if (employeeId) {
    const employee = (await canViewEmployee(employeeId, session.user.role, session.user.id)) ? await getEmployee(employeeId) : undefined;
    employees = employee ? [employee] : [];
  }
  return NextResponse.json({ goals: employees.flatMap((employee) => employee.goals) });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const session = getMockSession();
  if (body.employeeId && !(await canViewEmployee(body.employeeId, session.user.role, session.user.id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const goal = await createGoal(body);
  return NextResponse.json({ goal }, { status: 201 });
}
