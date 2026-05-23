"use client";

import { useState } from "react";
import { BrainCircuit, Loader2, Sparkles } from "lucide-react";
import { AIReviewDraft } from "@/lib/types";

type EmployeeOption = {
  id: string;
  name: string;
  title: string;
};

export function ReviewGenerator({ employees }: { employees: EmployeeOption[] }) {
  const [employeeId, setEmployeeId] = useState(employees[0]?.id ?? "");
  const [cycleName, setCycleName] = useState("Year-End Review");
  const [draft, setDraft] = useState<AIReviewDraft | null>(null);
  const [loading, setLoading] = useState(false);

  async function generateDraft() {
    if (!employeeId) return;
    setLoading(true);
    setDraft(null);
    try {
      const response = await fetch("/api/reviews/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ employeeId, cycleName })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Unable to generate review");
      setDraft(data.draft);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mb-6 metric-card">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
              <BrainCircuit className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-slate-950">AI Review Generator</h2>
              <p className="text-sm text-slate-600">Generate evidence-backed manager review drafts from goals, feedback, skills, and career data.</p>
            </div>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-[minmax(180px,1fr)_160px_auto]">
          <select className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm" value={employeeId} onChange={(event) => setEmployeeId(event.target.value)}>
            {employees.map((employee) => (
              <option key={employee.id} value={employee.id}>
                {employee.name} - {employee.title}
              </option>
            ))}
          </select>
          <select className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm" value={cycleName} onChange={(event) => setCycleName(event.target.value)}>
            <option>Mid-Year Review</option>
            <option>Year-End Review</option>
            <option>Promotion Packet</option>
          </select>
          <button className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-brand-700" type="button" onClick={generateDraft} disabled={loading || !employeeId}>
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            Generate
          </button>
        </div>
      </div>

      {draft ? (
        <div className="mt-5 grid gap-4 lg:grid-cols-3">
          <div className="rounded-lg border border-slate-200 bg-slate-50 p-4 lg:col-span-2">
            <div className="text-xs font-semibold uppercase tracking-wide text-slate-500">{draft.reviewCycle}</div>
            <h3 className="mt-2 text-lg font-bold text-slate-950">{draft.employeeName}</h3>
            <p className="mt-3 text-sm leading-6 text-slate-700">{draft.managerSummary}</p>
            <p className="mt-4 text-sm font-semibold text-slate-950">Promotion readiness</p>
            <p className="mt-1 text-sm leading-6 text-slate-700">{draft.promotionReadiness}</p>
            <p className="mt-4 text-sm font-semibold text-slate-950">Calibration notes</p>
            <p className="mt-1 text-sm leading-6 text-slate-700">{draft.calibrationNotes}</p>
          </div>
          <div className="space-y-4">
            <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-4">
              <div className="text-sm font-semibold text-emerald-900">Suggested rating</div>
              <div className="mt-2 text-3xl font-bold text-emerald-700">{draft.suggestedRating}/5</div>
            </div>
            <ReviewList title="Strengths" items={draft.strengths} />
            <ReviewList title="Improvement areas" items={draft.improvementAreas} />
            <ReviewList title="Development plan" items={draft.developmentPlan} />
          </div>
        </div>
      ) : null}
    </section>
  );
}

function ReviewList({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-4">
      <div className="text-sm font-semibold text-slate-950">{title}</div>
      <ul className="mt-2 space-y-2 text-sm leading-5 text-slate-700">
        {items.map((item) => (
          <li key={item}>- {item}</li>
        ))}
      </ul>
    </div>
  );
}
