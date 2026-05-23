import { getEmployees } from "@/lib/data";
import { PageHeader, StatusBadge } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function FeedbackPage() {
  const employees = await getEmployees();
  const feedback = employees.flatMap((employee) => employee.feedback.map((item) => ({ ...item, employeeName: employee.user.name })));
  return (
    <div>
      <PageHeader title="Feedback System" description="Manager, peer, self-review, and 360 feedback with date-based history and sentiment tagging." />
      <div className="grid gap-4 md:grid-cols-3">
        {feedback.slice(0, 24).map((item) => (
          <div key={item.id} className="metric-card">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-slate-950">{item.employeeName}</div>
                <div className="text-xs text-slate-500">{item.type.replaceAll("_", " ")} - {item.createdAt}</div>
              </div>
              <StatusBadge value={item.sentiment} />
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-700">{item.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
