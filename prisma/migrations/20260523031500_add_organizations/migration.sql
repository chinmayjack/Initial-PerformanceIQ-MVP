-- CreateTable
CREATE TABLE "Organization" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "plan" TEXT NOT NULL DEFAULT 'Pilot',
    "industry" TEXT NOT NULL,
    "seats" INTEGER NOT NULL DEFAULT 25,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organization_slug_key" ON "Organization"("slug");

-- Seed primary tenant before backfilling existing rows.
INSERT INTO "Organization" ("id", "name", "slug", "plan", "industry", "seats", "updatedAt")
VALUES
  ('org-acme', 'Acme Health Systems', 'acme-health', 'Pilot', 'Healthcare Technology', 75, CURRENT_TIMESTAMP),
  ('org-nova', 'NovaWorks Labs', 'novaworks', 'Sandbox', 'AI Infrastructure', 40, CURRENT_TIMESTAMP)
ON CONFLICT ("slug") DO NOTHING;

-- AlterTable
ALTER TABLE "User" ADD COLUMN "organizationId" TEXT;
UPDATE "User" SET "organizationId" = 'org-acme' WHERE "organizationId" IS NULL;
ALTER TABLE "User" ALTER COLUMN "organizationId" SET NOT NULL;

-- AlterTable
ALTER TABLE "Department" ADD COLUMN "organizationId" TEXT;
UPDATE "Department" SET "organizationId" = 'org-acme' WHERE "organizationId" IS NULL;
ALTER TABLE "Department" ALTER COLUMN "organizationId" SET NOT NULL;

-- AlterTable
ALTER TABLE "EmployeeProfile" ADD COLUMN "organizationId" TEXT;
UPDATE "EmployeeProfile" SET "organizationId" = 'org-acme' WHERE "organizationId" IS NULL;
ALTER TABLE "EmployeeProfile" ALTER COLUMN "organizationId" SET NOT NULL;

-- DropIndex
DROP INDEX IF EXISTS "User_email_key";
DROP INDEX IF EXISTS "Department_name_key";

-- CreateIndex
CREATE UNIQUE INDEX "User_organizationId_email_key" ON "User"("organizationId", "email");
CREATE UNIQUE INDEX "Department_organizationId_name_key" ON "Department"("organizationId", "name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "Department" ADD CONSTRAINT "Department_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "EmployeeProfile" ADD CONSTRAINT "EmployeeProfile_organizationId_fkey" FOREIGN KEY ("organizationId") REFERENCES "Organization"("id") ON DELETE CASCADE ON UPDATE CASCADE;
