import { generateMockInsight } from "@/lib/ai-insights";
import { getCurrentOrganization, getCurrentUser, getDepartments, getEmployees, getVisibleEmployees } from "@/lib/data";
import { KpiCard, PageHeader, ProgressBar, StatusBadge } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const currentUser = await getCurrentUser();
  const organization = await getCurrentOrganization();
  const departments = await getDepartments();
  const employees = await getEmployees();
  const directReports = await getVisibleEmployees("MANAGER", currentUser.id);
  const atRisk = employees.filter((employee) => generateMockInsight(employee).riskLevel === "At Risk");
  const topPerformers = employees.filter((employee) => employee.performanceScore >= 88);
  const employee = employees.find((profile) => profile.id === "emp-1") ?? employees[0];
  const departmentNames = new Map(departments.map((department) => [department.id, department.name]));
  const reportGoals = directReports.flatMap((profile) => profile.goals);
  const averageGoalProgress = reportGoals.length ? Math.round(reportGoals.reduce((sum, goal) => sum + goal.progress, 0) / reportGoals.length) : 0;

  return (
    <div>
      <PageHeader title="Performance Dashboard" description="Role-aware performance health, goal progress, risk alerts, feedback summaries, and promotion signals." />
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <KpiCard label="Workspace" value={organization.name} detail={`${organization.plan} plan - ${organization.industry}`} />
        <KpiCard label="Team members" value={directReports.length} detail="Visible to manager session" />
        <KpiCard label="Avg goal progress" value={`${averageGoalProgress}%`} detail="Across direct reports" />
        <KpiCard label="At-risk employees" value={atRisk.length} detail="AI rule-based watchlist" />
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="metric-card xl:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-950">Manager Team View</h2>
            <span className="text-sm text-slate-500">{currentUser.name}</span>
          </div>
          <div className="overflow-x-auto">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Goal Progress</th>
                  <th>Readiness</th>
                  <th>AI Signal</th>
                </tr>
              </thead>
              <tbody>
                {directReports.map((profile) => {
                  const insight = generateMockInsight(profile);
                  const progress = Math.round(profile.goals.reduce((sum, goal) => sum + goal.progress, 0) / profile.goals.length);
                  return (
                    <tr key={profile.id}>
                      <td>
                        <div className="font-medium text-slate-950">{profile.user.name}</div>
                        <div className="text-xs text-slate-500">{profile.title}</div>
                      </td>
                      <td>{departmentNames.get(profile.departmentId) ?? "Unknown"}</td>
                      <td className="min-w-36">
                        <div className="mb-1 text-xs text-slate-500">{progress}%</div>
                        <ProgressBar value={progress} />
                      </td>
                      <td>{profile.promotionReadinessScore}</td>
                      <td>{insight.riskLevel}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="metric-card">
          <h2 className="text-lg font-semibold text-slate-950">Employee Day-1 View</h2>
          <div className="mt-4 space-y-4">
            <div>
              <div className="text-sm font-medium text-slate-950">{employee.user.name}</div>
              <div className="text-sm text-slate-500">{employee.title} to {employee.careerPath.nextRole}</div>
            </div>
            {employee.goals.map((goal) => (
              <div key={goal.id}>
                <div className="mb-1 flex justify-between text-sm">
                  <span>{goal.title}</span>
                  <span>{goal.progress}%</span>
                </div>
                <ProgressBar value={goal.progress} />
              </div>
            ))}
            <div className="rounded-md bg-slate-50 p-3 text-sm text-slate-700">{generateMockInsight(employee).goalPrediction}</div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-6 xl:grid-cols-3">
        <div className="metric-card">
          <h2 className="text-lg font-semibold text-slate-950">HR Organization Health</h2>
          <div className="mt-4 space-y-3">
            {departments.map((department) => {
              const deptEmployees = employees.filter((employeeProfile) => employeeProfile.departmentId === department.id);
              const average = Math.round(deptEmployees.reduce((sum, employeeProfile) => sum + employeeProfile.performanceScore, 0) / deptEmployees.length);
              return (
                <div key={department.id} className="flex items-center justify-between rounded-md border border-slate-200 p-3">
                  <span className="text-sm font-medium">{department.name}</span>
                  <span className="text-sm text-slate-600">{average} avg score</span>
                </div>
              );
            })}
          </div>
        </div>
        <div className="metric-card">
          <h2 className="text-lg font-semibold text-slate-950">Top Performers</h2>
          <div className="mt-4 space-y-3">
            {topPerformers.slice(0, 5).map((profile) => (
              <div key={profile.id} className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium text-slate-950">{profile.user.name}</div>
                  <div className="text-xs text-slate-500">{profile.title}</div>
                </div>
                <span className="text-sm font-semibold">{profile.performanceScore}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="metric-card">
          <h2 className="text-lg font-semibold text-slate-950">Risk Alerts</h2>
          <div className="mt-4 space-y-3">
            {atRisk.slice(0, 5).map((profile) => (
              <div key={profile.id} className="rounded-md border border-rose-100 bg-rose-50 p-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-rose-950">{profile.user.name}</span>
                  <StatusBadge value="AT_RISK" />
                </div>
                <p className="mt-2 text-xs text-rose-700">{generateMockInsight(profile).performanceRiskSummary}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
