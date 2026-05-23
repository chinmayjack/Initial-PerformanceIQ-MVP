import { generateMockInsight } from "@/lib/ai-insights";
import { getEmployees } from "@/lib/data";
import { PageHeader } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  const employees = await getEmployees();
  const insights = employees.slice(0, 12).map((employee) => ({ employee, insight: generateMockInsight(employee) }));
  return (
    <div>
      <PageHeader title="AI Performance Insights" description="Mock AI insights with OpenAI-ready service wrapper and rule-based fallback when no API key is present." />
      <div className="grid gap-5 xl:grid-cols-2">
        {insights.map(({ employee, insight }) => (
          <article key={employee.id} className="metric-card">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">{employee.user.name}</h2>
                <p className="text-sm text-slate-500">{employee.title} - {insight.riskLevel}</p>
              </div>
              <div className="rounded-md bg-slate-100 px-3 py-2 text-sm font-semibold text-slate-700">{employee.performanceScore} performance</div>
            </div>
            <div className="mt-4 grid gap-3 text-sm text-slate-700">
              <p><strong>Goal prediction:</strong> {insight.goalPrediction}</p>
              <p><strong>Risk summary:</strong> {insight.performanceRiskSummary}</p>
              <p><strong>Promotion:</strong> {insight.promotionSummary}</p>
              <p><strong>Career path:</strong> {insight.suggestedCareerPath}</p>
              <p><strong>Learning areas:</strong> {insight.recommendedLearningAreas.join(", ")}</p>
              <p><strong>Manager coaching:</strong> {insight.managerCoachingSuggestions.join(" ")}</p>
              <p><strong>Executive summary:</strong> {insight.executiveSummary}</p>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
