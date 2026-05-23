import { NextRequest, NextResponse } from "next/server";
import { canViewEmployee, createGoal, getCurrentUser, getEmployee, getVisibleEmployees } from "@/lib/data";

export async function GET(request: NextRequest) {
  const employeeId = request.nextUrl.searchParams.get("employeeId");
  const currentUser = await getCurrentUser();
  let employees = await getVisibleEmployees(currentUser.role, currentUser.id);
  if (employeeId) {
    const employee = (await canViewEmployee(employeeId, currentUser.role, currentUser.id)) ? await getEmployee(employeeId) : undefined;
    employees = employee ? [employee] : [];
  }
  return NextResponse.json({ goals: employees.flatMap((employee) => employee.goals) });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const currentUser = await getCurrentUser();
  if (body.employeeId && !(await canViewEmployee(body.employeeId, currentUser.role, currentUser.id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const goal = await createGoal(body);
  return NextResponse.json({ goal }, { status: 201 });
}
