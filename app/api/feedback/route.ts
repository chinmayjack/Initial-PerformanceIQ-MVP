import { NextRequest, NextResponse } from "next/server";
import { getMockSession } from "@/lib/auth";
import { canViewEmployee, getEmployee, getVisibleEmployees } from "@/lib/data";

export async function GET(request: NextRequest) {
  const employeeId = request.nextUrl.searchParams.get("employeeId");
  const session = getMockSession();
  let employees = await getVisibleEmployees(session.user.role, session.user.id);
  if (employeeId) {
    const employee = (await canViewEmployee(employeeId, session.user.role, session.user.id)) ? await getEmployee(employeeId) : undefined;
    employees = employee ? [employee] : [];
  }
  return NextResponse.json({ feedback: employees.flatMap((employee) => employee.feedback) });
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  return NextResponse.json(
    {
      feedback: {
        id: `feedback-new-${Date.now()}`,
        createdAt: new Date().toISOString(),
        ...body
      }
    },
    { status: 201 }
  );
}
