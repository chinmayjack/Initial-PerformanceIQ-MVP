import { getDepartments, getEmployees } from "@/lib/data";
import { PageHeader, ProgressBar } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function EmployeesPage() {
  const employees = await getEmployees();
  const departments = await getDepartments();
  const departmentNames = new Map(departments.map((department) => [department.id, department.name]));

  return (
    <div>
      <PageHeader title="Employee Profiles" description="Complete talent profiles with role, department, manager, skills, career aspirations, and performance signals." />
      <div className="metric-card overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Role</th>
              <th>Department</th>
              <th>Level</th>
              <th>Joined</th>
              <th>Performance</th>
              <th>Engagement</th>
              <th>Promotion</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.id}>
                <td>
                  <div className="font-medium text-slate-950">{employee.user.name}</div>
                  <div className="text-xs text-slate-500">{employee.careerAspirations}</div>
                </td>
                <td>{employee.title}</td>
                <td>{departmentNames.get(employee.departmentId) ?? "Unknown"}</td>
                <td>{employee.currentLevel}</td>
                <td>{employee.joiningDate}</td>
                <td><ProgressBar value={employee.performanceScore} /></td>
                <td>{employee.engagementScore}</td>
                <td>{employee.promotionReadinessScore}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
