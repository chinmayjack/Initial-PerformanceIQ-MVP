import { Building2, CheckCircle2, KeyRound, LockKeyhole, UsersRound } from "lucide-react";
import { getCurrentOrganization, getCurrentUser, getDepartments, getEmployees } from "@/lib/data";
import { PageHeader } from "@/components/ui";

export const dynamic = "force-dynamic";

const readinessItems = [
  "Tenant-scoped Prisma queries",
  "Organization-specific user emails",
  "Role-based workspace access",
  "Seeded pilot workspace data",
  "Ready for SSO provider wiring"
];

export default async function WorkspacePage() {
  const organization = await getCurrentOrganization();
  const currentUser = await getCurrentUser();
  const employees = await getEmployees();
  const departments = await getDepartments();

  return (
    <div>
      <PageHeader title="Workspace Settings" description="Company workspace, tenant isolation, seat planning, and launch readiness controls for enterprise pilots." />

      <section className="grid gap-5 lg:grid-cols-3">
        <div className="metric-card lg:col-span-2">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
              <Building2 className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-950">{organization.name}</h2>
              <p className="mt-1 text-sm text-slate-600">{organization.industry}</p>
            </div>
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-3">
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Workspace slug</div>
              <div className="mt-2 text-sm font-semibold text-slate-950">{organization.slug}</div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Plan</div>
              <div className="mt-2 text-sm font-semibold text-slate-950">{organization.plan}</div>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-4">
              <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">Seat capacity</div>
              <div className="mt-2 text-sm font-semibold text-slate-950">{employees.length}/{organization.seats}</div>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center gap-3">
            <UsersRound className="h-5 w-5 text-brand-700" />
            <h2 className="text-lg font-semibold text-slate-950">Current Session</h2>
          </div>
          <div className="mt-4 space-y-3 text-sm text-slate-700">
            <div className="flex justify-between gap-4"><span>User</span><strong>{currentUser.name}</strong></div>
            <div className="flex justify-between gap-4"><span>Role</span><strong>{currentUser.role.replace("_", " ")}</strong></div>
            <div className="flex justify-between gap-4"><span>Departments</span><strong>{departments.length}</strong></div>
            <div className="flex justify-between gap-4"><span>Profiles</span><strong>{employees.length}</strong></div>
          </div>
        </div>
      </section>

      <section className="mt-6 grid gap-5 lg:grid-cols-2">
        <div className="metric-card">
          <div className="flex items-center gap-3">
            <LockKeyhole className="h-5 w-5 text-brand-700" />
            <h2 className="text-lg font-semibold text-slate-950">Tenant Isolation</h2>
          </div>
          <p className="mt-3 text-sm leading-6 text-slate-600">
            Data access is scoped by organization before employees, departments, goals, reviews, feedback, analytics, or AI insights are loaded.
          </p>
          <div className="mt-4 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-medium text-emerald-800">
            Active tenant boundary: {organization.id}
          </div>
        </div>

        <div className="metric-card">
          <div className="flex items-center gap-3">
            <KeyRound className="h-5 w-5 text-brand-700" />
            <h2 className="text-lg font-semibold text-slate-950">Pilot Readiness</h2>
          </div>
          <div className="mt-4 space-y-3">
            {readinessItems.map((item) => (
              <div key={item} className="flex items-center gap-3 text-sm text-slate-700">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
