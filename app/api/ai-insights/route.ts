import { NextRequest, NextResponse } from "next/server";
import { generateAIInsight } from "@/lib/ai-insights";
import { canViewEmployee, getCurrentUser, getEmployee } from "@/lib/data";

export async function GET(request: NextRequest) {
  const employeeId = request.nextUrl.searchParams.get("employeeId") ?? "emp-1";
  const currentUser = await getCurrentUser();
  if (!(await canViewEmployee(employeeId, currentUser.role, currentUser.id))) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }
  const employee = await getEmployee(employeeId);
  if (!employee) {
    return NextResponse.json({ error: "Employee not found" }, { status: 404 });
  }
  return NextResponse.json({ insight: await generateAIInsight(employee) });
}
