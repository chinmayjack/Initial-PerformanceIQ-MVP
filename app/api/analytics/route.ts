import { NextResponse } from "next/server";
import { generateMockInsight } from "@/lib/ai-insights";
import { getCurrentOrganization, getDepartments, getEmployees } from "@/lib/data";

export const dynamic = "force-dynamic";

export async function GET() {
  const workspace = await getCurrentOrganization();
  const employees = await getEmployees();
  const departments = await getDepartments();
  return NextResponse.json({
    organization: {
      id: workspace.id,
      name: workspace.name,
      slug: workspace.slug,
      plan: workspace.plan,
      industry: workspace.industry,
      seats: workspace.seats,
      totalEmployees: employees.length,
      averagePerformance: Math.round(employees.reduce((sum, employee) => sum + employee.performanceScore, 0) / employees.length),
      atRiskEmployees: employees.filter((employee) => generateMockInsight(employee).riskLevel === "At Risk").length,
      promotionCandidates: employees.filter((employee) => employee.performanceScore > 85 && employee.promotionReadinessScore > 80).length
    },
    departments: departments.map((department) => {
      const departmentEmployees = employees.filter((employee) => employee.departmentId === department.id);
      return {
        id: department.id,
        name: department.name,
        averagePerformance: Math.round(departmentEmployees.reduce((sum, employee) => sum + employee.performanceScore, 0) / departmentEmployees.length),
        averageReadiness: Math.round(departmentEmployees.reduce((sum, employee) => sum + employee.promotionReadinessScore, 0) / departmentEmployees.length)
      };
    })
  });
}
