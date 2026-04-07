import type { AuthSession } from "@/lib/types";

export function isSessionValid(session: AuthSession | null): session is AuthSession {
  if (!session) {
    return false;
  }

  const now = Date.now();
  const expiry = new Date(session.expiresAt).getTime();

  return Number.isFinite(expiry) && expiry > now;
}

export function canAccessPatientRoute(session: AuthSession | null): boolean {
  // SECURITY NOTE: Route guards in frontend are only UX safeguards.
  // Every protected record request must enforce object-level authorization on the server.
  return isSessionValid(session) && session.role === "patient";
}
