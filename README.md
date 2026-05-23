# PerformanceIQ

PerformanceIQ is a full-stack enterprise SaaS MVP for AI-powered employee performance management. It helps managers, employees, HR admins, and executives track goals, feedback, career growth, promotion readiness, review cycles, and predictive performance insights from day 1.

## Stack

- Next.js App Router, TypeScript, Tailwind CSS
- Next.js API routes
- PostgreSQL with Prisma
- Mock role-based auth
- OpenAI-ready AI insight service with deterministic mock fallback
- Recharts analytics

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Copy environment variables:

```bash
cp .env.example .env
```

3. Start PostgreSQL and update `DATABASE_URL` in `.env`.

4. Create and seed the database:

```bash
npm run prisma:migrate
npm run prisma:seed
```

If you already had the earlier single-tenant schema, create a new migration after pulling these changes:

```bash
npm run prisma:migrate -- --name add-organizations
npm run prisma:seed
```

5. Run the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

The UI reads through `lib/data.ts`, which now queries Prisma directly. PostgreSQL must be running and seeded for the app to load production data.

## Mock Auth

The default mock session is manager `Ava Patel` inside the `acme-health` organization workspace. Access rules are implemented in `lib/auth.ts` and tenant scoping is centralized in `lib/data.ts`:

- Employee: own profile, goals, feedback, and career path
- Manager: own profile plus direct reports
- HR Admin: all employees
- Executive: aggregated dashboards only

API examples:

- `GET /api/employees`
- `GET /api/employees?role=HR_ADMIN`
- `GET /api/goals?employeeId=emp-1`
- `GET /api/ai-insights?employeeId=emp-1`

## Data Flow

- Frontend pages call `lib/data.ts`.
- API routes call the same data layer.
- `lib/data.ts` resolves the active organization first, then queries Prisma inside that tenant.
- `POST /api/goals` writes through Prisma.
- `lib/mock-data.ts` remains only as the seed data source.

## Multi-Tenant Workspaces

The schema includes an `Organization` model. Users, departments, and employee profiles belong to an organization, and runtime queries are scoped to the active workspace from `lib/session.ts`.

Current seeded workspaces:

- `acme-health` - primary pilot workspace with seeded employee performance data
- `novaworks` - sandbox workspace for future demo isolation

## AI Logic

`lib/ai-insights.ts` uses OpenAI if `OPENAI_API_KEY` is present. Without a key it applies MVP rules:

- Goal progress below 50% and year progress above 60% marks the employee at risk.
- Performance score above 85 and promotion readiness above 80 marks a promotion candidate.
- Engagement below 60 suggests manager intervention.
- Natural-language summaries are generated from employee data.

## Modules

- Dashboard: manager, employee, HR, and executive-style health snapshots
- Employee Profile: employee metadata, skills, scores, aspirations
- Goal Management: yearly goals, milestones, status, priority, objective linkage
- Feedback: manager, peer, self-review, and 360 feedback with sentiment
- AI Insights: prediction, risk, promotion, career, learning, coaching, executive summary
- Career Path: next role, missing skills, training, readiness timeline
- Review Cycle: mid-year and year-end reviews with ratings and plans
- Analytics: goal completion, score distribution, readiness, risk, sentiment trends

## Phase 2 Features

- Real OpenAI integration with persisted AIInsight records, review-cycle prompt templates, and manager-specific coaching generation
- Workday, SAP SuccessFactors, and HRIS integrations for employee profiles, hierarchy, compensation bands, and calibration packets
- Slack and Microsoft Teams feedback capture with lightweight praise, coaching notes, and 360 prompts
- Predictive attrition modeling using engagement, goal velocity, manager changes, workload signals, and feedback sentiment
- Fine-grained RBAC, audit logs, SSO/SAML, SCIM provisioning, and field-level privacy controls
- Workflow automation for review cycles, promotion packets, calibration meetings, and development-plan reminders

## Startup Launch Assets

- Deployment guide: `docs/deployment.md`
- Pilot outreach pack: `docs/pilot-outreach.md`
- Public demo landing page: `/`
- AI review generator: `/reviews`
- Workspace readiness page: `/workspace`
