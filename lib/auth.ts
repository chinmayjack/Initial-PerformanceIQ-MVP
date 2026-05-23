import { getSessionContext } from "./session";
import { Role, User } from "./types";

export type Session = {
  user: User;
  profileId?: string;
};

export function getMockSession(role?: Role): Session {
  const session = getSessionContext();
  const user = {
    id: session.userEmail,
    name: session.userName,
    email: session.userEmail,
    role: role ?? session.userRole
  };
  return { user };
}
