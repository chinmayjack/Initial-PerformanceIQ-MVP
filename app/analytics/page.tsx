import { CompletionChart, DepartmentReadinessChart, DistributionChart, RiskPieChart, SentimentTrendChart } from "@/components/charts";
import { generateMockInsight } from "@/lib/ai-insights";
import { getCurrentOrganization, getDepartments, getEmployees } from "@/lib/data";
import { PageHeader } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const organization = await getCurrentOrganization();
  const employees = await getEmployees();
  const departments = await getDepartments();
  const departmentNames = new Map(departments.map((department) => [department.id, department.name]));
  const teamCompletion = employees.slice(0, 10).map((employee) => ({
    name: employee.user.name.split(" ")[0],
    progress: Math.round(employee.goals.reduce((sum, goal) => sum + goal.progress, 0) / employee.goals.length)
  }));
  const distribution = ["50-59", "60-69", "70-79", "80-89", "90-100"].map((range) => {
    const [low, high] = range.split("-").map(Number);
    return { range, count: employees.filter((employee) => employee.performanceScore >= low && employee.performanceScore <= high).length };
  });
  const readiness = departments.map((department) => {
    const departmentEmployees = employees.filter((employee) => employee.departmentId === department.id);
    return {
      department: departmentNames.get(department.id) ?? "Unknown",
      readiness: Math.round(departmentEmployees.reduce((sum, employee) => sum + employee.promotionReadinessScore, 0) / departmentEmployees.length)
    };
  });
  const riskCounts = [
    { name: "Healthy", value: employees.filter((employee) => generateMockInsight(employee).riskLevel === "Healthy").length },
    { name: "Watch", value: employees.filter((employee) => generateMockInsight(employee).riskLevel === "Watch").length },
    { name: "At Risk", value: employees.filter((employee) => generateMockInsight(employee).riskLevel === "At Risk").length }
  ];
  const sentimentTrend = [
    { month: "Jan", Positive: 8, Neutral: 5, Improvement: 2 },
    { month: "Feb", Positive: 10, Neutral: 4, Improvement: 3 },
    { month: "Mar", Positive: 12, Neutral: 6, Improvement: 2 },
    { month: "Apr", Positive: 11, Neutral: 5, Improvement: 4 },
    { month: "May", Positive: 14, Neutral: 4, Improvement: 2 }
  ];

  return (
    <div>
      <PageHeader title="Analytics" description={`Tenant-scoped analytics for ${organization.name}: completion, performance distribution, readiness, risk, and feedback sentiment.`} />
      <div className="grid gap-6 xl:grid-cols-2">
        <div className="metric-card"><h2 className="mb-4 text-lg font-semibold">Team Goal Completion</h2><CompletionChart data={teamCompletion} /></div>
        <div className="metric-card"><h2 className="mb-4 text-lg font-semibold">Performance Score Distribution</h2><DistributionChart data={distribution} /></div>
        <div className="metric-card"><h2 className="mb-4 text-lg font-semibold">Promotion Readiness by Department</h2><DepartmentReadinessChart data={readiness} /></div>
        <div className="metric-card"><h2 className="mb-4 text-lg font-semibold">At-Risk Employees</h2><RiskPieChart data={riskCounts} /></div>
        <div className="metric-card xl:col-span-2"><h2 className="mb-4 text-lg font-semibold">Feedback Sentiment Trends</h2><SentimentTrendChart data={sentimentTrend} /></div>
      </div>
    </div>
  );
}
