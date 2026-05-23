import { Role, User } from "./types";
import { defaultOrganizationSlug } from "./tenants";

export const defaultSessionUser: User = {
  id: "user-mgr-ava",
  name: "Ava Patel",
  email: "ava.patel@performanceiq.local",
  role: "MANAGER" as Role
};

export const defaultSession = {
  organizationSlug: defaultOrganizationSlug,
  userEmail: defaultSessionUser.email,
  role: defaultSessionUser.role
};
