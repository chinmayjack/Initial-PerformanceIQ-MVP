import { cookies } from "next/headers";
import { defaultSession, defaultSessionUser, sessionCookieNames } from "./session-config";
import { Role } from "./types";

export function getSessionContext() {
  const cookieStore = cookies();
  return {
    organizationSlug: cookieStore.get(sessionCookieNames.organizationSlug)?.value ?? defaultSession.organizationSlug,
    userEmail: cookieStore.get(sessionCookieNames.userEmail)?.value ?? defaultSession.userEmail,
    userName: cookieStore.get(sessionCookieNames.userName)?.value ?? defaultSessionUser.name,
    userRole: (cookieStore.get(sessionCookieNames.userRole)?.value ?? defaultSessionUser.role) as Role
  };
}
