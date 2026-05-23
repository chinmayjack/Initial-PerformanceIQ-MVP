import Link from "next/link";
import { ArrowRight, BarChart3, BrainCircuit, CheckCircle2, ShieldCheck, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      <section className="surface-band min-h-[88vh] px-5 py-8 text-white sm:px-8 lg:px-12">
        <nav className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white text-brand-700">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-bold">PerformanceIQ</div>
              <div className="text-xs text-blue-100">AI performance management</div>
            </div>
          </div>
          <Link href="/dashboard" className="rounded-md bg-white px-4 py-2 text-sm font-semibold text-slate-950 shadow-soft">
            Open Demo
          </Link>
        </nav>

        <div className="mx-auto grid max-w-7xl gap-10 pb-10 pt-20 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-100">
              Built for manager-led performance reviews
            </div>
            <h1 className="mt-5 max-w-4xl text-4xl font-bold tracking-tight sm:text-6xl">
              Turn scattered performance data into fair, evidence-backed reviews.
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-blue-50">
              PerformanceIQ helps managers track goals, feedback, career growth, promotion readiness, and AI-generated review drafts from one tenant-safe workspace.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/reviews" className="inline-flex items-center justify-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-semibold text-slate-950 shadow-soft">
                Try AI Review Generator
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link href="/workspace" className="inline-flex items-center justify-center gap-2 rounded-md border border-white/20 bg-white/10 px-5 py-3 text-sm font-semibold text-white">
                View Workspace Security
              </Link>
            </div>
          </div>

          <div className="rounded-lg border border-white/15 bg-white/10 p-5 shadow-2xl backdrop-blur">
            <div className="rounded-lg bg-white p-5 text-slate-950">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-semibold text-slate-500">Review readiness</div>
                  <div className="mt-1 text-2xl font-bold">Acme Health Systems</div>
                </div>
                <div className="rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">Live pilot</div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                <Metric label="Goal evidence" value="86%" />
                <Metric label="Risk alerts" value="3" />
                <Metric label="Review time saved" value="72%" />
              </div>
              <div className="mt-5 rounded-lg bg-slate-50 p-4">
                <div className="text-sm font-semibold">AI manager summary</div>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Maya delivered strong annual progress, shows promotion readiness, and should document cross-functional impact before calibration.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="px-5 py-16 sm:px-8 lg:px-12">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-5 md:grid-cols-3">
            <Feature icon={<BrainCircuit className="h-5 w-5" />} title="AI review generation" body="Draft manager reviews from goals, feedback, scores, skills, and promotion readiness." />
            <Feature icon={<ShieldCheck className="h-5 w-5" />} title="Tenant-safe workspace" body="Organization-scoped data model ready for pilots, SSO, and customer isolation." />
            <Feature icon={<BarChart3 className="h-5 w-5" />} title="Executive analytics" body="Spot risk, promotion readiness, sentiment trends, and department health in minutes." />
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</div>
      <div className="mt-2 text-2xl font-bold text-slate-950">{value}</div>
    </div>
  );
}

function Feature({ icon, title, body }: { icon: React.ReactNode; title: string; body: string }) {
  return (
    <div className="metric-card">
      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">{icon}</div>
      <h2 className="mt-4 text-lg font-semibold text-slate-950">{title}</h2>
      <p className="mt-2 text-sm leading-6 text-slate-600">{body}</p>
      <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-emerald-700">
        <CheckCircle2 className="h-4 w-4" />
        Pilot ready
      </div>
    </div>
  );
}
