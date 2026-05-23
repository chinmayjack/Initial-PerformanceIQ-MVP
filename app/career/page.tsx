import { getEmployees } from "@/lib/data";
import { PageHeader, ProgressBar } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function CareerPage() {
  const employees = await getEmployees();

  return (
    <div>
      <PageHeader title="Career Paths" description="Current role, next role, skill requirements, missing skills, training, and readiness timelines." />
      <div className="grid gap-5 lg:grid-cols-2">
        {employees.slice(0, 10).map((employee) => (
          <div key={employee.id} className="metric-card">
            <div className="flex items-start justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-slate-950">{employee.user.name}</h2>
                <p className="text-sm text-slate-500">{employee.careerPath.currentRole} to {employee.careerPath.nextRole}</p>
              </div>
              <span className="rounded-md bg-brand-50 px-3 py-2 text-sm font-semibold text-brand-700">{employee.careerPath.readinessTimeline}</span>
            </div>
            <div className="mt-4">
              <div className="mb-1 flex justify-between text-sm"><span>Promotion readiness</span><span>{employee.promotionReadinessScore}%</span></div>
              <ProgressBar value={employee.promotionReadinessScore} />
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <h3 className="text-sm font-semibold text-slate-950">Required skills</h3>
                <p className="mt-2 text-sm text-slate-600">{employee.careerPath.requiredSkills.join(", ")}</p>
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-950">Missing skills</h3>
                <p className="mt-2 text-sm text-slate-600">{employee.careerPath.missingSkills.join(", ") || "No major gaps"}</p>
              </div>
            </div>
            <div className="mt-4 rounded-md bg-slate-50 p-3 text-sm text-slate-700">{employee.careerPath.recommendedTraining.join(" - ")}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
