export const AUTH_ROUTES = [
  "/patient/login",
  "/patient/register",
  "/patient/forgot-access",
] as const;

export const PROTECTED_PATIENT_ROUTES = [
  "/patient/dashboard",
  "/patient/token-status",
  "/patient/appointments",
  "/patient/prescriptions",
  "/patient/reports",
  "/patient/profile",
  "/patient/support",
  "/patient/settings",
] as const;

export const DEFAULT_PROTECTED_ROUTE = "/patient/dashboard";
