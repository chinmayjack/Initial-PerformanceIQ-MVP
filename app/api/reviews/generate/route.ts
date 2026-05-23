import { NextRequest, NextResponse } from "next/server";
import { generateAIReviewDraft } from "@/lib/ai-insights";
import { getMockSession } from "@/lib/auth";
import { canViewEmployee, getEmployee } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const employeeId = body.employeeId as string | undefined;
  const cycleName = (body.cycleName as string | undefined) ?? "Year-End Review";
  const session = getMockSession();

  if (!employeeId) {
    return NextResponse.json({ error: "employeeId is required" }, { status: 400 });
  }

  if (!(await canViewEmployee(employeeId, session.user.role, session.user.id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const employee = await getEmployee(employeeId);
  if (!employee) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }

  const draft = await generateAIReviewDraft(employee, cycleName);
  return NextResponse.json({ draft });
}
