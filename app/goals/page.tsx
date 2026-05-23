import { getEmployees } from "@/lib/data";
import { PageHeader } from "@/components/ui";
import { GoalManager } from "@/components/goal-manager";

export const dynamic = "force-dynamic";

export default async function GoalsPage() {
  const employees = await getEmployees();
  const goals = employees.flatMap((employee) => employee.goals.map((goal) => ({ ...goal, employeeName: employee.user.name })));
  return (
    <div>
      <PageHeader title="Goal Management" description="Yearly goals, milestones, priority, status, progress, and company objective linkage." />
      <GoalManager initialGoals={goals} />
    </div>
  );
}
