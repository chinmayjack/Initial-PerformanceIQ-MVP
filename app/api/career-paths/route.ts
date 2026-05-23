import { NextRequest, NextResponse } from "next/server";
import { canViewEmployee, getCurrentUser, getEmployee, getVisibleEmployees } from "@/lib/data";

export async function GET(request: NextRequest) {
  const employeeId = request.nextUrl.searchParams.get("employeeId");
  const currentUser = await getCurrentUser();
  let employees = await getVisibleEmployees(currentUser.role, currentUser.id);
  if (employeeId) {
    const employee = (await canViewEmployee(employeeId, currentUser.role, currentUser.id)) ? await getEmployee(employeeId) : undefined;
    employees = employee ? [employee] : [];
  }
  return NextResponse.json({ careerPaths: employees.map((employee) => employee.careerPath) });
}
