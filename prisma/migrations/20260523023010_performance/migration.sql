-- CreateEnum
CREATE TYPE "Role" AS ENUM ('EMPLOYEE', 'MANAGER', 'HR_ADMIN', 'EXECUTIVE');

-- CreateEnum
CREATE TYPE "GoalStatus" AS ENUM ('NOT_STARTED', 'ON_TRACK', 'AT_RISK', 'COMPLETED');

-- CreateEnum
CREATE TYPE "GoalPriority" AS ENUM ('LOW', 'MEDIUM', 'HIGH');

-- CreateEnum
CREATE TYPE "FeedbackType" AS ENUM ('MANAGER', 'PEER', 'SELF_REVIEW', 'REVIEW_360');

-- CreateEnum
CREATE TYPE "Sentiment" AS ENUM ('POSITIVE', 'NEUTRAL', 'IMPROVEMENT_NEEDED');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "role" "Role" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "objective" TEXT NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "EmployeeProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "departmentId" TEXT NOT NULL,
    "managerId" TEXT,
    "title" TEXT NOT NULL,
    "joiningDate" TIMESTAMP(3) NOT NULL,
    "currentLevel" TEXT NOT NULL,
    "careerAspirations" TEXT NOT NULL,
    "performanceScore" INTEGER NOT NULL,
    "engagementScore" INTEGER NOT NULL,
    "promotionReadinessScore" INTEGER NOT NULL,

    CONSTRAINT "EmployeeProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Skill" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "proficiency" INTEGER NOT NULL,
    "employeeId" TEXT NOT NULL,

    CONSTRAINT "Skill_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Goal" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "progress" INTEGER NOT NULL,
    "priority" "GoalPriority" NOT NULL,
    "status" "GoalStatus" NOT NULL,
    "companyObjective" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Goal_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Milestone" (
    "id" TEXT NOT NULL,
    "goalId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "dueDate" TIMESTAMP(3) NOT NULL,
    "completed" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Milestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Feedback" (
    "id" TEXT NOT NULL,
    "receiverId" TEXT NOT NULL,
    "authorId" TEXT,
    "type" "FeedbackType" NOT NULL,
    "sentiment" "Sentiment" NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Feedback_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ReviewCycle" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "cycleName" TEXT NOT NULL,
    "period" TEXT NOT NULL,
    "managerRating" INTEGER NOT NULL,
    "selfRating" INTEGER NOT NULL,
    "finalCalibrationRating" INTEGER NOT NULL,
    "strengths" TEXT NOT NULL,
    "improvementAreas" TEXT NOT NULL,
    "developmentPlan" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReviewCycle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CareerPath" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "currentRole" TEXT NOT NULL,
    "nextRole" TEXT NOT NULL,
    "requiredSkills" TEXT[],
    "missingSkills" TEXT[],
    "recommendedTraining" TEXT[],
    "readinessTimeline" TEXT NOT NULL,

    CONSTRAINT "CareerPath_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AIInsight" (
    "id" TEXT NOT NULL,
    "employeeId" TEXT NOT NULL,
    "riskLevel" TEXT NOT NULL,
    "goalPrediction" TEXT NOT NULL,
    "promotionSummary" TEXT NOT NULL,
    "careerSummary" TEXT NOT NULL,
    "learningAreas" TEXT[],
    "coachingSuggestions" TEXT[],
    "executiveSummary" TEXT NOT NULL,
    "generatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AIInsight_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Department_name_key" ON "Department"("name");

-- CreateIndex
CREATE UNIQUE INDEX "EmployeeProfile_userId_key" ON "EmployeeProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CareerPath_employeeId_key" ON "CareerPath"("employeeId");

-- AddForeignKey
ALTER TABLE "EmployeeProfile" ADD CONSTRAINT "EmployeeProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeProfile" ADD CONSTRAINT "EmployeeProfile_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeProfile" ADD CONSTRAINT "EmployeeProfile_managerId_fkey" FOREIGN KEY ("managerId") REFERENCES "EmployeeProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Skill" ADD CONSTRAINT "Skill_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "EmployeeProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Goal" ADD CONSTRAINT "Goal_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "EmployeeProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Milestone" ADD CONSTRAINT "Milestone_goalId_fkey" FOREIGN KEY ("goalId") REFERENCES "Goal"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_receiverId_fkey" FOREIGN KEY ("receiverId") REFERENCES "EmployeeProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Feedback" ADD CONSTRAINT "Feedback_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "EmployeeProfile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ReviewCycle" ADD CONSTRAINT "ReviewCycle_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "EmployeeProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CareerPath" ADD CONSTRAINT "CareerPath_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "EmployeeProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AIInsight" ADD CONSTRAINT "AIInsight_employeeId_fkey" FOREIGN KEY ("employeeId") REFERENCES "EmployeeProfile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
