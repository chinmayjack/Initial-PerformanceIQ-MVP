import { clsx } from "clsx";

export function PageHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="mb-6 overflow-hidden rounded-lg border border-white/70 bg-white/75 shadow-soft ring-1 ring-slate-900/5 backdrop-blur">
      <div className="surface-band px-5 py-5 sm:px-6">
        <div className="inline-flex rounded-full border border-white/15 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-teal-100">
          Performance intelligence
        </div>
        <h1 className="mt-3 text-2xl font-bold tracking-tight text-white sm:text-3xl">{title}</h1>
        <p className="mt-2 max-w-3xl text-sm leading-6 text-blue-50">{description}</p>
      </div>
    </div>
  );
}

export function KpiCard({ label, value, detail }: { label: string; value: string | number; detail: string }) {
  return (
    <div className="metric-card relative overflow-hidden">
      <div className="absolute right-0 top-0 h-20 w-20 rounded-bl-full bg-brand-50" />
      <div className="relative text-sm font-medium text-slate-500">{label}</div>
      <div className="relative mt-2 text-3xl font-bold text-slate-950">{value}</div>
      <div className="mt-2 text-sm text-slate-600">{detail}</div>
    </div>
  );
}

export function StatusBadge({ value }: { value: string }) {
  const styles = {
    COMPLETED: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    ON_TRACK: "bg-blue-50 text-blue-700 ring-blue-200",
    AT_RISK: "bg-rose-50 text-rose-700 ring-rose-200",
    NOT_STARTED: "bg-slate-100 text-slate-700 ring-slate-200",
    POSITIVE: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    NEUTRAL: "bg-slate-100 text-slate-700 ring-slate-200",
    IMPROVEMENT_NEEDED: "bg-amber-50 text-amber-700 ring-amber-200",
    HIGH: "bg-rose-50 text-rose-700 ring-rose-200",
    MEDIUM: "bg-amber-50 text-amber-700 ring-amber-200",
    LOW: "bg-slate-100 text-slate-700 ring-slate-200"
  } as Record<string, string>;
  return <span className={clsx("inline-flex rounded-full px-2 py-1 text-xs font-semibold ring-1", styles[value] ?? "bg-slate-100 text-slate-700 ring-slate-200")}>{value.replaceAll("_", " ")}</span>;
}

export function ProgressBar({ value }: { value: number }) {
  return (
    <div className="h-2 w-full rounded-full bg-slate-100 ring-1 ring-slate-200">
      <div className="h-2 rounded-full bg-gradient-to-r from-brand-600 to-teal-500" style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
    </div>
  );
}
