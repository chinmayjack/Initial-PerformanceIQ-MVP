"use client";

import { useState } from "react";
import { Loader2, MessageSquarePlus, Star } from "lucide-react";
import { EmployeeProfile, Sentiment } from "@/lib/types";

export function ReviewCommentManager({ employees }: { employees: EmployeeProfile[] }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(formData: FormData) {
    setLoading(true);
    setMessage("");
    try {
      const mode = String(formData.get("mode"));
      const endpoint = mode === "review" ? "/api/reviews" : "/api/feedback";
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries()))
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Unable to save progress note");
      setMessage(mode === "review" ? "Review added. Refreshing..." : "Manager comment added. Refreshing...");
      setTimeout(() => window.location.reload(), 700);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to save progress note");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mb-6 metric-card">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
          <MessageSquarePlus className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Manager Progress Notes</h2>
          <p className="text-sm text-slate-600">Add review-cycle entries or manager comments for coaching, calibration, and ongoing progress.</p>
        </div>
      </div>

      <form action={submit} className="mt-5 grid gap-3 lg:grid-cols-4">
        <select className="rounded-md border border-slate-200 px-3 py-2 text-sm" name="mode" required>
          <option value="feedback">Manager comment</option>
          <option value="review">Review entry</option>
        </select>
        <select className="rounded-md border border-slate-200 px-3 py-2 text-sm" name="employeeId" required>
          {employees.map((employee) => (
            <option key={employee.id} value={employee.id}>{employee.user.name} - {employee.title}</option>
          ))}
        </select>
        <select className="rounded-md border border-slate-200 px-3 py-2 text-sm" name="sentiment" defaultValue={"NEUTRAL" satisfies Sentiment}>
          <option value="POSITIVE">Positive</option>
          <option value="NEUTRAL">Neutral</option>
          <option value="IMPROVEMENT_NEEDED">Improvement Needed</option>
        </select>
        <input className="rounded-md border border-slate-200 px-3 py-2 text-sm" max="5" min="1" name="managerRating" placeholder="Rating 1-5" type="number" />
        <input className="rounded-md border border-slate-200 px-3 py-2 text-sm" name="cycleName" placeholder="Cycle, e.g. Q3 Check-in" />
        <input className="rounded-md border border-slate-200 px-3 py-2 text-sm" name="period" placeholder="Period, e.g. 2026 Q3" />
        <input className="rounded-md border border-slate-200 px-3 py-2 text-sm lg:col-span-2" name="developmentPlan" placeholder="Development plan" />
        <textarea className="min-h-24 rounded-md border border-slate-200 px-3 py-2 text-sm lg:col-span-2" name="body" placeholder="Manager comment or review summary" required />
        <textarea className="min-h-24 rounded-md border border-slate-200 px-3 py-2 text-sm" name="strengths" placeholder="Strengths for review entry" />
        <textarea className="min-h-24 rounded-md border border-slate-200 px-3 py-2 text-sm" name="improvementAreas" placeholder="Improvement areas for review entry" />
        <button className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white lg:col-span-4" disabled={loading} type="submit">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Star className="h-4 w-4" />}
          Save Progress Note
        </button>
      </form>

      {message ? <div className="mt-4 rounded-md bg-slate-50 p-3 text-sm text-slate-700">{message}</div> : null}
    </section>
  );
}
