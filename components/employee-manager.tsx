"use client";

import { useState } from "react";
import { Loader2, UserPlus } from "lucide-react";
import { Department, EmployeeProfile } from "@/lib/types";

export function EmployeeManager({ departments, managers }: { departments: Department[]; managers: EmployeeProfile[] }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function submit(formData: FormData) {
    setLoading(true);
    setMessage("");
    try {
      const response = await fetch("/api/employees", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(formData.entries()))
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Unable to add employee");
      setMessage(`Added ${data.employee.user.name}. Refreshing...`);
      setTimeout(() => window.location.reload(), 700);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to add employee");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mb-6 metric-card">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-50 text-brand-700">
          <UserPlus className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-slate-950">Add Employee</h2>
          <p className="text-sm text-slate-600">Create a tenant-scoped employee profile with onboarding goals and a starter career path.</p>
        </div>
      </div>

      <form action={submit} className="mt-5 grid gap-3 lg:grid-cols-4">
        <input className="rounded-md border border-slate-200 px-3 py-2 text-sm" name="name" placeholder="Full name" required />
        <input className="rounded-md border border-slate-200 px-3 py-2 text-sm" name="email" placeholder="Work email" required type="email" />
        <input className="rounded-md border border-slate-200 px-3 py-2 text-sm" name="title" placeholder="Role title" required />
        <input className="rounded-md border border-slate-200 px-3 py-2 text-sm" name="currentLevel" placeholder="Level, e.g. L3" required />
        <select className="rounded-md border border-slate-200 px-3 py-2 text-sm" name="departmentId" required>
          {departments.map((department) => (
            <option key={department.id} value={department.id}>{department.name}</option>
          ))}
        </select>
        <select className="rounded-md border border-slate-200 px-3 py-2 text-sm" name="managerId">
          <option value="">No manager</option>
          {managers.map((manager) => (
            <option key={manager.id} value={manager.id}>{manager.user.name}</option>
          ))}
        </select>
        <input className="rounded-md border border-slate-200 px-3 py-2 text-sm" name="joiningDate" required type="date" />
        <input className="rounded-md border border-slate-200 px-3 py-2 text-sm" name="careerAspirations" placeholder="Next role aspiration" required />
        <button className="inline-flex items-center justify-center gap-2 rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white lg:col-span-4" disabled={loading} type="submit">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
          Add Employee
        </button>
      </form>

      {message ? <div className="mt-4 rounded-md bg-slate-50 p-3 text-sm text-slate-700">{message}</div> : null}
    </section>
  );
}
