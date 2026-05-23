import { prisma } from "./prisma";
import { getSessionContext } from "./session";
import { Department, EmployeeProfile, Goal, Organization, Role, User } from "./types";

const employeeInclude = {
  user: true,
  department: true,
  skills: true,
  goals: { include: { milestones: true } },
  feedbackReceived: true,
  reviewCycles: true,
  careerPath: true
};

function dateOnly(value: Date | string) {
  return new Date(value).toISOString().slice(0, 10);
}

function mapEmployee(profile: any): EmployeeProfile {
  return {
    id: profile.id,
    organizationId: profile.organizationId,
    user: profile.user,
    departmentId: profile.departmentId,
    managerId: profile.managerId ?? undefined,
    title: profile.title,
    joiningDate: dateOnly(profile.joiningDate),
    currentLevel: profile.currentLevel,
    careerAspirations: profile.careerAspirations,
    performanceScore: profile.performanceScore,
    engagementScore: profile.engagementScore,
    promotionReadinessScore: profile.promotionReadinessScore,
    skills: profile.skills,
    goals: profile.goals.map((goal: any) => ({
      id: goal.id,
      employeeId: goal.employeeId,
      title: goal.title,
      description: goal.description,
      year: goal.year,
      progress: goal.progress,
      priority: goal.priority,
      status: goal.status,
      companyObjective: goal.companyObjective,
      milestones: goal.milestones.map((milestone: any) => ({
        id: milestone.id,
        title: milestone.title,
        dueDate: dateOnly(milestone.dueDate),
        completed: milestone.completed
      }))
    })),
    feedback: profile.feedbackReceived.map((feedback: any) => ({
      id: feedback.id,
      receiverId: feedback.receiverId,
      authorId: feedback.authorId ?? undefined,
      type: feedback.type,
      sentiment: feedback.sentiment,
      body: feedback.body,
      createdAt: dateOnly(feedback.createdAt)
    })),
    reviews: profile.reviewCycles,
    careerPath: profile.careerPath
  };
}

export async function getCurrentUser(): Promise<User> {
  const organization = await getCurrentOrganization();
  const session = getSessionContext();
  const user = await prisma.user.findUnique({
    where: {
      organizationId_email: {
        organizationId: organization.id,
        email: session.userEmail
      }
    }
  });
  if (!user) {
    throw new Error(`Session user ${session.userEmail} was not found in ${organization.slug}.`);
  }
  return { id: user.id, organizationId: user.organizationId, name: user.name, email: user.email, role: user.role as Role };
}

export async function getCurrentOrganization(): Promise<Organization> {
  const session = getSessionContext();
  const organization = await prisma.organization.findUnique({ where: { slug: session.organizationSlug } });
  if (!organization) {
    throw new Error(`Organization workspace ${session.organizationSlug} was not found. Run prisma seed after migrating.`);
  }
  return organization;
}

export async function getLoginOptions() {
  return prisma.organization.findMany({
    orderBy: { name: "asc" },
    include: {
      users: {
        orderBy: { name: "asc" },
        select: {
          id: true,
          name: true,
          email: true,
          role: true
        }
      }
    }
  });
}

export async function getDepartments(): Promise<Department[]> {
  const organization = await getCurrentOrganization();
  return prisma.department.findMany({
    where: { organizationId: organization.id },
    orderBy: { name: "asc" }
  });
}

export async function getEmployees(): Promise<EmployeeProfile[]> {
  const organization = await getCurrentOrganization();
  const profiles = await prisma.employeeProfile.findMany({
    where: { organizationId: organization.id },
    include: employeeInclude,
    orderBy: { user: { name: "asc" } }
  });
  return profiles.map(mapEmployee);
}

export async function getEmployee(employeeId: string) {
  const employees = await getEmployees();
  return employees.find((employee) => employee.id === employeeId);
}

export async function getDepartmentName(departmentId: string) {
  const departments = await getDepartments();
  return departments.find((department) => department.id === departmentId)?.name ?? "Unknown";
}

export async function getVisibleEmployees(role?: Role, userId?: string) {
  const currentUser = await getCurrentUser();
  const activeRole = role ?? currentUser.role;
  const activeUserId = userId ?? currentUser.id;
  const employees = await getEmployees();

  if (activeRole === "HR_ADMIN") return employees;
  if (activeRole === "EXECUTIVE") return [];

  const requester = employees.find((employee) => employee.user.id === activeUserId);
  if (!requester) return [];
  if (activeRole === "MANAGER") {
    return employees.filter((employee) => employee.managerId === requester.id);
  }
  return [requester];
}

export async function canViewEmployee(employeeId: string, role?: Role, userId?: string) {
  const currentUser = await getCurrentUser();
  const activeRole = role ?? currentUser.role;
  const activeUserId = userId ?? currentUser.id;
  if (activeRole === "HR_ADMIN") return true;
  if (activeRole === "EXECUTIVE") return false;

  const employees = await getEmployees();
  const requester = employees.find((employee) => employee.user.id === activeUserId);
  if (!requester) return false;
  if (activeRole === "MANAGER") {
    return requester.id === employeeId || employees.some((employee) => employee.id === employeeId && employee.managerId === requester.id);
  }
  return requester.id === employeeId;
}

export async function createGoal(input: Partial<Goal>) {
  const canCreate = input.employeeId ? await canViewEmployee(input.employeeId) : false;
  if (!canCreate) {
    throw new Error("Cannot create a goal outside the active organization workspace.");
  }
  const milestones = input.milestones ?? [];
  const goal = await prisma.goal.create({
    data: {
      employeeId: input.employeeId!,
      title: input.title!,
      description: input.description ?? "New goal created in PerformanceIQ.",
      year: input.year ?? new Date().getFullYear(),
      progress: input.progress ?? 0,
      priority: input.priority ?? "MEDIUM",
      status: input.status ?? "NOT_STARTED",
      companyObjective: input.companyObjective ?? "Improve company performance transparency",
      ...(milestones.length
        ? {
            milestones: {
              create: milestones.map((milestone) => ({
                title: milestone.title,
                dueDate: new Date(milestone.dueDate),
                completed: milestone.completed
              }))
            }
          }
        : {})
    },
    include: { milestones: true }
  });
  return {
    id: goal.id,
    employeeId: goal.employeeId,
    title: goal.title,
    description: goal.description,
    year: goal.year,
    progress: goal.progress,
    priority: goal.priority,
    status: goal.status,
    companyObjective: goal.companyObjective,
    milestones: goal.milestones.map((milestone) => ({
      id: milestone.id,
      title: milestone.title,
      dueDate: dateOnly(milestone.dueDate),
      completed: milestone.completed
    }))
  };
}
