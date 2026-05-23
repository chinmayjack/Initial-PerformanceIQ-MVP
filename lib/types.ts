export type Role = "EMPLOYEE" | "MANAGER" | "HR_ADMIN" | "EXECUTIVE";
export type GoalStatus = "NOT_STARTED" | "ON_TRACK" | "AT_RISK" | "COMPLETED";
export type GoalPriority = "LOW" | "MEDIUM" | "HIGH";
export type FeedbackType = "MANAGER" | "PEER" | "SELF_REVIEW" | "REVIEW_360";
export type Sentiment = "POSITIVE" | "NEUTRAL" | "IMPROVEMENT_NEEDED";

export type Department = {
  id: string;
  organizationId?: string;
  name: string;
  objective: string;
};

export type User = {
  id: string;
  organizationId?: string;
  name: string;
  email: string;
  role: Role;
};

export type Organization = {
  id: string;
  name: string;
  slug: string;
  plan: string;
  industry: string;
  seats: number;
};

export type Skill = {
  id: string;
  name: string;
  category: string;
  proficiency: number;
};

export type Milestone = {
  id: string;
  title: string;
  dueDate: string;
  completed: boolean;
};

export type Goal = {
  id: string;
  employeeId: string;
  title: string;
  description: string;
  year: number;
  progress: number;
  priority: GoalPriority;
  status: GoalStatus;
  companyObjective: string;
  milestones: Milestone[];
};

export type Feedback = {
  id: string;
  receiverId: string;
  authorId?: string;
  type: FeedbackType;
  sentiment: Sentiment;
  body: string;
  createdAt: string;
};

export type ReviewCycle = {
  id: string;
  employeeId: string;
  cycleName: string;
  period: string;
  managerRating: number;
  selfRating: number;
  finalCalibrationRating: number;
  strengths: string;
  improvementAreas: string;
  developmentPlan: string;
};

export type CareerPath = {
  id: string;
  employeeId: string;
  currentRole: string;
  nextRole: string;
  requiredSkills: string[];
  missingSkills: string[];
  recommendedTraining: string[];
  readinessTimeline: string;
};

export type EmployeeProfile = {
  id: string;
  organizationId?: string;
  user: User;
  departmentId: string;
  managerId?: string;
  title: string;
  joiningDate: string;
  currentLevel: string;
  careerAspirations: string;
  performanceScore: number;
  engagementScore: number;
  promotionReadinessScore: number;
  skills: Skill[];
  goals: Goal[];
  feedback: Feedback[];
  reviews: ReviewCycle[];
  careerPath: CareerPath;
};

export type AIInsight = {
  employeeId: string;
  riskLevel: "Healthy" | "Watch" | "At Risk" | "Promotion Candidate";
  goalPrediction: string;
  performanceRiskSummary: string;
  promotionSummary: string;
  suggestedCareerPath: string;
  recommendedLearningAreas: string[];
  managerCoachingSuggestions: string[];
  executiveSummary: string;
};

export type AIReviewDraft = {
  employeeId: string;
  employeeName: string;
  reviewCycle: string;
  managerSummary: string;
  strengths: string[];
  improvementAreas: string[];
  promotionReadiness: string;
  developmentPlan: string[];
  calibrationNotes: string;
  suggestedRating: number;
};
