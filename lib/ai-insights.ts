import { AIInsight, AIReviewDraft, EmployeeProfile } from "./types";

function yearProgressPercent(date = new Date()) {
  const start = new Date(date.getFullYear(), 0, 1).getTime();
  const end = new Date(date.getFullYear() + 1, 0, 1).getTime();
  return Math.round(((date.getTime() - start) / (end - start)) * 100);
}

export function generateMockInsight(employee: EmployeeProfile, date = new Date()): AIInsight {
  const avgGoalProgress = Math.round(employee.goals.reduce((sum, goal) => sum + goal.progress, 0) / employee.goals.length);
  const yearProgress = yearProgressPercent(date);
  const goalAtRisk = avgGoalProgress < 50 && yearProgress > 60;
  const promotionCandidate = employee.performanceScore > 85 && employee.promotionReadinessScore > 80;
  const engagementRisk = employee.engagementScore < 60;

  let riskLevel: AIInsight["riskLevel"] = "Healthy";
  if (promotionCandidate) riskLevel = "Promotion Candidate";
  if (avgGoalProgress < 60 || employee.engagementScore < 68) riskLevel = "Watch";
  if (goalAtRisk || engagementRisk) riskLevel = "At Risk";

  return {
    employeeId: employee.id,
    riskLevel,
    goalPrediction: goalAtRisk
      ? `${employee.user.name} is behind expected pacing with ${avgGoalProgress}% average goal progress against ${yearProgress}% year progress.`
      : `${employee.user.name} is pacing toward ${avgGoalProgress >= 75 ? "strong" : "moderate"} goal completion with ${avgGoalProgress}% average progress.`,
    performanceRiskSummary: engagementRisk
      ? `Engagement is below the healthy threshold at ${employee.engagementScore}. Manager intervention is recommended within the next two weeks.`
      : `Performance score is ${employee.performanceScore} and engagement is ${employee.engagementScore}, indicating ${riskLevel === "Healthy" ? "stable momentum" : "an area to watch"}.`,
    promotionSummary: promotionCandidate
      ? `${employee.user.name} is a promotion candidate based on performance score ${employee.performanceScore} and readiness score ${employee.promotionReadinessScore}.`
      : `Promotion readiness is ${employee.promotionReadinessScore}. Focus on closing skill gaps before calibration.`,
    suggestedCareerPath: `Recommended path: ${employee.title} to ${employee.careerPath.nextRole} in ${employee.careerPath.readinessTimeline}.`,
    recommendedLearningAreas: employee.careerPath.missingSkills.length
      ? employee.careerPath.missingSkills
      : ["Executive communication", "Scaling through influence"],
    managerCoachingSuggestions: [
      engagementRisk ? "Schedule a career and workload check-in." : "Reinforce progress with specific recognition.",
      goalAtRisk ? "Reset milestones and remove blockers this sprint." : "Ask for quantified impact updates before the next review.",
      promotionCandidate ? "Document promotion evidence and calibration examples." : "Agree on one visible stretch assignment."
    ],
    executiveSummary: `${employee.user.name} in ${employee.title} is classified as ${riskLevel}. The main drivers are ${avgGoalProgress}% goal progress, ${employee.performanceScore} performance score, and ${employee.promotionReadinessScore} promotion readiness.`
  };
}

export async function generateAIInsight(employee: EmployeeProfile) {
  if (!process.env.OPENAI_API_KEY) {
    return generateMockInsight(employee);
  }

  try {
    const OpenAI = (await import("openai")).default;
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "Generate concise employee performance insights as JSON matching the requested fields."
        },
        {
          role: "user",
          content: JSON.stringify({ employee })
        }
      ],
      response_format: { type: "json_object" }
    });
    const parsed = JSON.parse(completion.choices[0]?.message.content ?? "{}");
    return { ...generateMockInsight(employee), ...parsed };
  } catch {
    return generateMockInsight(employee);
  }
}

function buildReviewPrompt(employee: EmployeeProfile, cycleName: string) {
  return {
    employee: {
      name: employee.user.name,
      title: employee.title,
      level: employee.currentLevel,
      departmentId: employee.departmentId,
      performanceScore: employee.performanceScore,
      engagementScore: employee.engagementScore,
      promotionReadinessScore: employee.promotionReadinessScore,
      goals: employee.goals.map((goal) => ({
        title: goal.title,
        progress: goal.progress,
        status: goal.status,
        priority: goal.priority,
        companyObjective: goal.companyObjective
      })),
      feedback: employee.feedback.map((item) => ({
        type: item.type,
        sentiment: item.sentiment,
        body: item.body,
        createdAt: item.createdAt
      })),
      careerPath: employee.careerPath,
      skills: employee.skills.map((skill) => ({
        name: skill.name,
        category: skill.category,
        proficiency: skill.proficiency
      }))
    },
    cycleName
  };
}

export function generateMockReviewDraft(employee: EmployeeProfile, cycleName = "Year-End Review"): AIReviewDraft {
  const insight = generateMockInsight(employee);
  const avgGoalProgress = Math.round(employee.goals.reduce((sum, goal) => sum + goal.progress, 0) / employee.goals.length);
  const positiveFeedback = employee.feedback.filter((item) => item.sentiment === "POSITIVE").length;
  const improvementFeedback = employee.feedback.filter((item) => item.sentiment === "IMPROVEMENT_NEEDED").length;
  const suggestedRating = employee.performanceScore >= 88 ? 5 : employee.performanceScore >= 78 ? 4 : employee.performanceScore >= 68 ? 3 : 2;

  return {
    employeeId: employee.id,
    employeeName: employee.user.name,
    reviewCycle: cycleName,
    managerSummary: `${employee.user.name} delivered ${avgGoalProgress}% average goal progress as a ${employee.title}. The review signal is ${insight.riskLevel.toLowerCase()}, with performance score ${employee.performanceScore}, engagement ${employee.engagementScore}, and promotion readiness ${employee.promotionReadinessScore}.`,
    strengths: [
      positiveFeedback > 0 ? "Creates visible trust with peers and partners." : "Maintains reliable execution across core responsibilities.",
      avgGoalProgress >= 70 ? "Shows strong ownership of annual goals and measurable outcomes." : "Has clear opportunities to improve goal pacing with tighter milestones.",
      employee.skills.sort((a, b) => b.proficiency - a.proficiency)[0]?.name ?? "Functional expertise"
    ],
    improvementAreas: [
      improvementFeedback > 0 ? "Address recurring feedback themes with a concrete behavior plan." : "Increase the specificity of impact narratives before calibration.",
      avgGoalProgress < 65 ? "Reset goal operating rhythm and escalate blockers earlier." : "Translate strong execution into more repeatable team practices.",
      employee.engagementScore < 65 ? "Partner with manager on workload, motivation, and career alignment." : "Continue strengthening executive communication."
    ],
    promotionReadiness: insight.promotionSummary,
    developmentPlan: [
      `Complete training in ${insight.recommendedLearningAreas[0] ?? "executive communication"}.`,
      "Create a monthly evidence log for goals, feedback, metrics, and cross-functional outcomes.",
      `Take one stretch assignment aligned to ${employee.careerPath.nextRole}.`
    ],
    calibrationNotes: `Suggested calibration rating is ${suggestedRating}/5. Evidence basis: ${avgGoalProgress}% goal progress, ${positiveFeedback} positive feedback items, ${improvementFeedback} improvement themes, and readiness score ${employee.promotionReadinessScore}.`,
    suggestedRating
  };
}

export async function generateAIReviewDraft(employee: EmployeeProfile, cycleName = "Year-End Review") {
  if (!process.env.OPENAI_API_KEY) {
    return generateMockReviewDraft(employee, cycleName);
  }

  try {
    const OpenAI = (await import("openai")).default;
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: process.env.OPENAI_REVIEW_MODEL ?? "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content:
            "You generate fair, evidence-backed employee performance review drafts for managers. Return strict JSON with fields: employeeId, employeeName, reviewCycle, managerSummary, strengths array, improvementAreas array, promotionReadiness, developmentPlan array, calibrationNotes, suggestedRating number from 1-5. Do not invent facts beyond the provided data."
        },
        {
          role: "user",
          content: JSON.stringify(buildReviewPrompt(employee, cycleName))
        }
      ],
      response_format: { type: "json_object" }
    });
    const parsed = JSON.parse(completion.choices[0]?.message.content ?? "{}");
    return { ...generateMockReviewDraft(employee, cycleName), ...parsed };
  } catch {
    return generateMockReviewDraft(employee, cycleName);
  }
}
