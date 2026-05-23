import { NextRequest, NextResponse } from "next/server";
import { canViewEmployee, createFeedback, getCurrentUser, getEmployee, getVisibleEmployees } from "@/lib/data";

export async function GET(request: NextRequest) {
  const employeeId = request.nextUrl.searchParams.get("employeeId");
  const currentUser = await getCurrentUser();
  let employees = await getVisibleEmployees(currentUser.role, currentUser.id);
  if (employeeId) {
    const employee = (await canViewEmployee(employeeId, currentUser.role, currentUser.id)) ? await getEmployee(employeeId) : undefined;
    employees = employee ? [employee] : [];
  }
  return NextResponse.json({ feedback: employees.flatMap((employee) => employee.feedback) });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const feedback = await createFeedback({
      receiverId: body.employeeId ?? body.receiverId,
      sentiment: body.sentiment,
      type: "MANAGER",
      body: body.body
    });
    return NextResponse.json({ feedback }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to add feedback" }, { status: 400 });
  }
}
