import { defaultSessionUser } from "./session";
import { Role, User } from "./types";

export type Session = {
  user: User;
  profileId?: string;
};

export function getMockSession(role?: Role): Session {
  const user = role ? { ...defaultSessionUser, role } : defaultSessionUser;
  return { user };
}
