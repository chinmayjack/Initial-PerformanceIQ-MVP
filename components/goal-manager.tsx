"use client";

import { useState } from "react";
import { ProgressBar, StatusBadge } from "@/components/ui";
import { Goal, GoalPriority } from "@/lib/types";

type GoalRow = Goal & { employeeName: string };

export function GoalManager({ initialGoals }: { initialGoals: GoalRow[] }) {
  const [goals, setGoals] = useState(initialGoals);
  const [title, setTitle] = useState("");
  const [objective, setObjective] = useState("");
  const [priority, setPriority] = useState<GoalPriority>("HIGH");
  const [milestone, setMilestone] = useState("");

  async function addGoal() {
    if (!title.trim()) return;
    const response = await fetch("/api/goals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        employeeId: "emp-1",
        title,
        description: "New goal created in the MVP workspace.",
        priority,
        companyObjective: objective || "Improve company performance transparency",
        milestones: milestone ? [{ id: `ms-new-${Date.now()}`, title: milestone, dueDate: "2026-12-31", completed: false }] : []
      })
    });
    const data = await response.json();
    setGoals([{ ...data.goal, employeeName: "Maya Johnson" }, ...goals]);
    setTitle("");
    setObjective("");
    setMilestone("");
    setPriority("HIGH");
  }

  return (
    <>
      <div className="mb-6 metric-card">
        <h2 className="text-lg font-semibold text-slate-950">Create Goal</h2>
        <form className="mt-4 grid gap-3 md:grid-cols-5">
          <input className="rounded-md border border-slate-200 px-3 py-2 text-sm" placeholder="Goal title" value={title} onChange={(event) => setTitle(event.target.value)} />
          <input className="rounded-md border border-slate-200 px-3 py-2 text-sm" placeholder="Company objective" value={objective} onChange={(event) => setObjective(event.target.value)} />
          <select className="rounded-md border border-slate-200 px-3 py-2 text-sm" value={priority} onChange={(event) => setPriority(event.target.value as GoalPriority)}>
            <option value="HIGH">High priority</option>
            <option value="MEDIUM">Medium priority</option>
            <option value="LOW">Low priority</option>
          </select>
          <input className="rounded-md border border-slate-200 px-3 py-2 text-sm" placeholder="Milestone" value={milestone} onChange={(event) => setMilestone(event.target.value)} />
          <button className="rounded-md bg-brand-600 px-4 py-2 text-sm font-semibold text-white" type="button" onClick={addGoal}>Add Goal</button>
        </form>
      </div>
      <div className="metric-card overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Goal</th>
              <th>Progress</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Milestones</th>
              <th>Objective</th>
            </tr>
          </thead>
          <tbody>
            {goals.map((goal) => (
              <tr key={goal.id}>
                <td>{goal.employeeName}</td>
                <td>
                  <div className="font-medium text-slate-950">{goal.title}</div>
                  <div className="text-xs text-slate-500">{goal.description}</div>
                </td>
                <td className="min-w-40"><ProgressBar value={goal.progress} /></td>
                <td><StatusBadge value={goal.priority} /></td>
                <td><StatusBadge value={goal.status} /></td>
                <td>{goal.milestones.filter((m) => m.completed).length}/{goal.milestones.length}</td>
                <td>{goal.companyObjective}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
