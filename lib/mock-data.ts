import {
  CareerPath,
  Department,
  EmployeeProfile,
  Feedback,
  FeedbackType,
  Goal,
  GoalPriority,
  GoalStatus,
  ReviewCycle,
  Role,
  Sentiment,
  Skill
} from "./types";

const departments: Department[] = [
  { id: "dept-product", name: "Product & Design", objective: "Increase activation and customer love" },
  { id: "dept-engineering", name: "Engineering", objective: "Ship reliable platform capabilities faster" },
  { id: "dept-revenue", name: "Revenue", objective: "Grow enterprise ARR and retention" }
];

const managers = [
  ["mgr-ava", "Ava Patel", "ava.patel@performanceiq.local", "VP Product", "dept-product"],
  ["mgr-marcus", "Marcus Lee", "marcus.lee@performanceiq.local", "Engineering Director", "dept-engineering"],
  ["mgr-sofia", "Sofia Ramirez", "sofia.ramirez@performanceiq.local", "Revenue Director", "dept-revenue"],
  ["mgr-ethan", "Ethan Brooks", "ethan.brooks@performanceiq.local", "Platform Manager", "dept-engineering"],
  ["mgr-nora", "Nora Chen", "nora.chen@performanceiq.local", "Customer Growth Manager", "dept-revenue"]
] as const;

const employees = [
  ["emp-1", "Maya Johnson", "Product Manager", "dept-product", "mgr-ava", 91, 83, 88, "Senior PM"],
  ["emp-2", "Liam Carter", "Product Designer", "dept-product", "mgr-ava", 78, 72, 67, "Lead Designer"],
  ["emp-3", "Priya Shah", "UX Researcher", "dept-product", "mgr-ava", 84, 76, 74, "Research Lead"],
  ["emp-4", "Owen Miller", "Data Analyst", "dept-product", "mgr-ava", 69, 58, 52, "Analytics Manager"],
  ["emp-5", "Hannah Kim", "Frontend Engineer", "dept-engineering", "mgr-marcus", 88, 81, 82, "Staff Engineer"],
  ["emp-6", "Noah Smith", "Backend Engineer", "dept-engineering", "mgr-marcus", 74, 64, 61, "Senior Engineer"],
  ["emp-7", "Aria Nguyen", "ML Engineer", "dept-engineering", "mgr-marcus", 93, 86, 90, "ML Tech Lead"],
  ["emp-8", "Lucas Brown", "QA Engineer", "dept-engineering", "mgr-ethan", 66, 55, 48, "QA Lead"],
  ["emp-9", "Grace Wilson", "DevOps Engineer", "dept-engineering", "mgr-ethan", 82, 78, 73, "SRE Lead"],
  ["emp-10", "Elijah Davis", "Security Engineer", "dept-engineering", "mgr-ethan", 79, 69, 71, "Security Architect"],
  ["emp-11", "Chloe Martin", "Account Executive", "dept-revenue", "mgr-sofia", 87, 84, 79, "Enterprise AE"],
  ["emp-12", "Daniel Garcia", "Sales Engineer", "dept-revenue", "mgr-sofia", 72, 62, 63, "Solutions Lead"],
  ["emp-13", "Isabella Moore", "Customer Success Manager", "dept-revenue", "mgr-nora", 89, 88, 86, "CS Team Lead"],
  ["emp-14", "James Taylor", "RevOps Analyst", "dept-revenue", "mgr-nora", 76, 71, 70, "RevOps Manager"],
  ["emp-15", "Mila Anderson", "Implementation Consultant", "dept-revenue", "mgr-nora", 64, 57, 54, "Engagement Lead"],
  ["emp-16", "Benjamin Thomas", "Product Ops Manager", "dept-product", "mgr-ava", 81, 77, 76, "Product Ops Lead"],
  ["emp-17", "Victoria White", "Mobile Engineer", "dept-engineering", "mgr-marcus", 85, 79, 80, "Senior Mobile Engineer"],
  ["emp-18", "William Harris", "Platform Engineer", "dept-engineering", "mgr-ethan", 71, 65, 59, "Senior Platform Engineer"],
  ["emp-19", "Zoe Clark", "Lifecycle Marketer", "dept-revenue", "mgr-sofia", 83, 82, 75, "Growth Lead"],
  ["emp-20", "Henry Lewis", "Content Strategist", "dept-product", "mgr-ava", 73, 61, 62, "Content Lead"]
] as const;

const skillBank = ["Strategic planning", "Stakeholder management", "Data storytelling", "Coaching", "Systems design", "Customer empathy", "Execution rigor", "AI fluency"];

function goalStatus(progress: number): GoalStatus {
  if (progress >= 95) return "COMPLETED";
  if (progress < 50) return "AT_RISK";
  return "ON_TRACK";
}

function makeSkills(seed: number): Skill[] {
  return [0, 1, 2, 3].map((offset) => ({
    id: `skill-${seed}-${offset}`,
    name: skillBank[(seed + offset) % skillBank.length],
    category: offset % 2 === 0 ? "Leadership" : "Functional",
    proficiency: 55 + ((seed * 9 + offset * 11) % 41)
  }));
}

function makeGoals(employeeId: string, seed: number): Goal[] {
  const progressA = 35 + ((seed * 13) % 64);
  const progressB = 25 + ((seed * 17) % 70);
  const priorities: GoalPriority[] = ["HIGH", "MEDIUM", "LOW"];
  return [
    {
      id: `goal-${employeeId}-1`,
      employeeId,
      title: "Deliver annual impact plan",
      description: "Drive measurable contribution against department operating priorities.",
      year: 2026,
      progress: progressA,
      priority: priorities[seed % priorities.length],
      status: goalStatus(progressA),
      companyObjective: departments[seed % departments.length].objective,
      milestones: [
        { id: `ms-${employeeId}-1`, title: "Define success metrics", dueDate: "2026-03-31", completed: true },
        { id: `ms-${employeeId}-2`, title: "Ship mid-year checkpoint", dueDate: "2026-07-31", completed: progressA > 55 }
      ]
    },
    {
      id: `goal-${employeeId}-2`,
      employeeId,
      title: "Build scalable team practices",
      description: "Improve operating rituals, documentation, and peer enablement.",
      year: 2026,
      progress: progressB,
      priority: priorities[(seed + 1) % priorities.length],
      status: goalStatus(progressB),
      companyObjective: "Improve manager effectiveness and performance transparency",
      milestones: [
        { id: `ms-${employeeId}-3`, title: "Launch working agreement", dueDate: "2026-04-30", completed: progressB > 40 },
        { id: `ms-${employeeId}-4`, title: "Complete enablement review", dueDate: "2026-09-30", completed: progressB > 70 }
      ]
    }
  ];
}

function makeFeedback(employeeId: string, managerId: string | undefined, seed: number): Feedback[] {
  const sentiments: Sentiment[] = ["POSITIVE", "NEUTRAL", "IMPROVEMENT_NEEDED"];
  const types: FeedbackType[] = ["MANAGER", "PEER", "SELF_REVIEW", "REVIEW_360"];
  return [0, 1, 2].map((offset) => ({
    id: `fb-${employeeId}-${offset}`,
    receiverId: employeeId,
    authorId: offset === 0 ? managerId : undefined,
    type: types[(seed + offset) % types.length],
    sentiment: sentiments[(seed + offset) % sentiments.length],
    body:
      offset === 0
        ? "Shows strong ownership and would benefit from tighter milestone communication."
        : offset === 1
          ? "Collaborates thoughtfully across functions and follows through on commitments."
          : "Self-reflection identifies growth in prioritization and executive storytelling.",
    createdAt: `2026-0${Math.min(5, offset + 2)}-15`
  }));
}

function makeReview(employeeId: string, seed: number): ReviewCycle[] {
  return ["Mid-Year Review", "Year-End Review"].map((cycleName, offset) => ({
    id: `review-${employeeId}-${offset}`,
    employeeId,
    cycleName,
    period: offset === 0 ? "2026 H1" : "2026 H2",
    managerRating: 3 + ((seed + offset) % 3),
    selfRating: 3 + ((seed + offset + 1) % 3),
    finalCalibrationRating: 3 + ((seed + offset + 2) % 3),
    strengths: "Consistent execution, cross-functional trust, and customer-focused decision making.",
    improvementAreas: "Sharper prioritization, earlier risk escalation, and more quantified impact narratives.",
    developmentPlan: "Pair with manager monthly on influence skills and complete one role-specific learning path."
  }));
}

function makeCareerPath(employeeId: string, title: string, aspiration: string, seed: number): CareerPath {
  const requiredSkills = ["Strategic planning", "Executive communication", "Coaching", "Data storytelling"];
  const missingSkills = requiredSkills.filter((_, index) => (index + seed) % 2 === 0);
  return {
    id: `career-${employeeId}`,
    employeeId,
    currentRole: title,
    nextRole: aspiration,
    requiredSkills,
    missingSkills,
    recommendedTraining: ["Manager excellence lab", "AI for business leaders", "Advanced influence workshop"],
    readinessTimeline: missingSkills.length <= 1 ? "3-6 months" : "6-12 months"
  };
}

const managerProfiles: EmployeeProfile[] = managers.map(([id, name, email, title, departmentId], index) => ({
  id,
  user: { id: `user-${id}`, name, email, role: "MANAGER" as Role },
  departmentId,
  title,
  joiningDate: `2021-0${(index % 5) + 1}-10`,
  currentLevel: "M4",
  careerAspirations: "Senior Director",
  performanceScore: 86 + (index % 8),
  engagementScore: 80 + (index % 10),
  promotionReadinessScore: 76 + (index % 13),
  skills: makeSkills(index),
  goals: makeGoals(id, index),
  feedback: makeFeedback(id, undefined, index),
  reviews: makeReview(id, index),
  careerPath: makeCareerPath(id, title, "Senior Director", index)
}));

const employeeProfiles: EmployeeProfile[] = employees.map(([id, name, title, departmentId, managerId, performance, engagement, promotion, aspiration], index) => ({
  id,
  user: {
    id: `user-${id}`,
    name,
    email: `${name.toLowerCase().replaceAll(" ", ".")}@performanceiq.local`,
    role: "EMPLOYEE"
  },
  departmentId,
  managerId,
  title,
  joiningDate: `202${index % 4 + 2}-${String((index % 9) + 1).padStart(2, "0")}-12`,
  currentLevel: index % 3 === 0 ? "L4" : index % 3 === 1 ? "L3" : "L5",
  careerAspirations: aspiration,
  performanceScore: performance,
  engagementScore: engagement,
  promotionReadinessScore: promotion,
  skills: makeSkills(index + 5),
  goals: makeGoals(id, index + 5),
  feedback: makeFeedback(id, managerId, index + 5),
  reviews: makeReview(id, index + 5),
  careerPath: makeCareerPath(id, title, aspiration, index + 5)
}));

export const mockUsers = [
  { id: "user-hr", name: "Harper Stone", email: "hr.admin@performanceiq.local", role: "HR_ADMIN" as Role },
  { id: "user-exec", name: "Jordan Blake", email: "executive@performanceiq.local", role: "EXECUTIVE" as Role },
  ...managerProfiles.map((profile) => profile.user),
  ...employeeProfiles.map((profile) => profile.user)
];

export const mockDepartments = departments;
export const mockEmployees = [...managerProfiles, ...employeeProfiles];
export const currentUser = mockUsers.find((user) => user.email === "ava.patel@performanceiq.local")!;

export function getDepartmentName(departmentId: string) {
  return mockDepartments.find((department) => department.id === departmentId)?.name ?? "Unknown";
}

export function getEmployee(id: string) {
  return mockEmployees.find((employee) => employee.id === id);
}

export function getVisibleEmployees(role: Role = currentUser.role, userId: string = currentUser.id) {
  if (role === "HR_ADMIN") return mockEmployees;
  if (role === "EXECUTIVE") return [];
  const profile = mockEmployees.find((employee) => employee.user.id === userId);
  if (!profile) return [];
  if (role === "MANAGER") return mockEmployees.filter((employee) => employee.managerId === profile.id);
  return [profile];
}
