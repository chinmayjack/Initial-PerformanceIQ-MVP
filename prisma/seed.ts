import { PrismaClient } from "@prisma/client";
import { mockDepartments, mockEmployees, mockUsers } from "../lib/mock-data";
import { organizations } from "../lib/tenants";

const prisma = new PrismaClient();
const primaryOrganizationId = "org-acme";

async function main() {
  await prisma.aIInsight.deleteMany();
  await prisma.careerPath.deleteMany();
  await prisma.reviewCycle.deleteMany();
  await prisma.feedback.deleteMany();
  await prisma.milestone.deleteMany();
  await prisma.goal.deleteMany();
  await prisma.skill.deleteMany();
  await prisma.employeeProfile.updateMany({ data: { managerId: null } });
  await prisma.employeeProfile.deleteMany();
  await prisma.user.deleteMany();
  await prisma.department.deleteMany();
  await prisma.organization.deleteMany();

  for (const organization of organizations) {
    await prisma.organization.create({ data: organization });
  }

  for (const department of mockDepartments) {
    await prisma.department.create({ data: { ...department, organizationId: primaryOrganizationId } });
  }

  for (const user of mockUsers) {
    await prisma.user.create({ data: { ...user, organizationId: primaryOrganizationId } });
  }

  for (const employee of mockEmployees) {
    await prisma.employeeProfile.create({
      data: {
        id: employee.id,
        organizationId: primaryOrganizationId,
        userId: employee.user.id,
        departmentId: employee.departmentId,
        managerId: employee.managerId,
        title: employee.title,
        joiningDate: new Date(employee.joiningDate),
        currentLevel: employee.currentLevel,
        careerAspirations: employee.careerAspirations,
        performanceScore: employee.performanceScore,
        engagementScore: employee.engagementScore,
        promotionReadinessScore: employee.promotionReadinessScore
      }
    });
  }

  for (const employee of mockEmployees) {
    for (const skill of employee.skills) {
      await prisma.skill.create({ data: { ...skill, employeeId: employee.id } });
    }
    for (const goal of employee.goals) {
      await prisma.goal.create({
        data: {
          id: goal.id,
          employeeId: employee.id,
          title: goal.title,
          description: goal.description,
          year: goal.year,
          progress: goal.progress,
          priority: goal.priority,
          status: goal.status,
          companyObjective: goal.companyObjective,
          milestones: {
            create: goal.milestones.map((milestone) => ({
              id: milestone.id,
              title: milestone.title,
              dueDate: new Date(milestone.dueDate),
              completed: milestone.completed
            }))
          }
        }
      });
    }
    for (const feedback of employee.feedback) {
      await prisma.feedback.create({
        data: {
          ...feedback,
          createdAt: new Date(feedback.createdAt)
        }
      });
    }
    for (const review of employee.reviews) {
      await prisma.reviewCycle.create({ data: review });
    }
    await prisma.careerPath.create({ data: employee.careerPath });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
