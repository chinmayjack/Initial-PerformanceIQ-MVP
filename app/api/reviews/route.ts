import { NextRequest, NextResponse } from "next/server";
import { canViewEmployee, createReview, getCurrentUser, getEmployee, getVisibleEmployees } from "@/lib/data";

export async function GET(request: NextRequest) {
  const employeeId = request.nextUrl.searchParams.get("employeeId");
  const currentUser = await getCurrentUser();
  let employees = await getVisibleEmployees(currentUser.role, currentUser.id);
  if (employeeId) {
    const employee = (await canViewEmployee(employeeId, currentUser.role, currentUser.id)) ? await getEmployee(employeeId) : undefined;
    employees = employee ? [employee] : [];
  }
  return NextResponse.json({ reviews: employees.flatMap((employee) => employee.reviews) });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const review = await createReview({
      employeeId: body.employeeId,
      cycleName: body.cycleName || "Manager Check-in",
      period: body.period || new Date().getFullYear().toString(),
      managerRating: Number(body.managerRating || 3),
      strengths: body.strengths || body.body || "Progress note added by manager.",
      improvementAreas: body.improvementAreas || "Continue tracking progress against agreed development areas.",
      developmentPlan: body.developmentPlan || "Review progress with manager in the next check-in."
    });
    return NextResponse.json({ review }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Unable to add review" }, { status: 400 });
  }
}
