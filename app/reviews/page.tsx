import { getEmployees } from "@/lib/data";
import { ReviewGenerator } from "@/components/review-generator";
import { PageHeader } from "@/components/ui";

export const dynamic = "force-dynamic";

export default async function ReviewsPage() {
  const employees = await getEmployees();
  const reviews = employees.flatMap((employee) => employee.reviews.map((review) => ({ ...review, employeeName: employee.user.name })));
  return (
    <div>
      <PageHeader title="Review Cycles" description="Mid-year and year-end reviews with manager, self, and calibration ratings plus development plans." />
      <ReviewGenerator employees={employees.map((employee) => ({ id: employee.id, name: employee.user.name, title: employee.title }))} />
      <div className="metric-card overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Employee</th>
              <th>Cycle</th>
              <th>Manager</th>
              <th>Self</th>
              <th>Calibration</th>
              <th>Strengths</th>
              <th>Improvement Areas</th>
              <th>Development Plan</th>
            </tr>
          </thead>
          <tbody>
            {reviews.slice(0, 32).map((review) => (
              <tr key={review.id}>
                <td>{review.employeeName}</td>
                <td>{review.cycleName}<div className="text-xs text-slate-500">{review.period}</div></td>
                <td>{review.managerRating}</td>
                <td>{review.selfRating}</td>
                <td>{review.finalCalibrationRating}</td>
                <td>{review.strengths}</td>
                <td>{review.improvementAreas}</td>
                <td>{review.developmentPlan}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
