import {
  Activity,
  CalendarDays,
  ClipboardList,
  FileClock,
  FileText,
  LayoutDashboard,
  LifeBuoy,
  Settings,
  UserRound,
} from "lucide-react";

export const patientNavItems = [
  { labelKey: "dashboard", href: "/patient/dashboard", icon: LayoutDashboard },
  { labelKey: "tokenStatus", href: "/patient/token-status", icon: FileClock },
  { labelKey: "appointments", href: "/patient/appointments", icon: CalendarDays },
  { labelKey: "prescriptions", href: "/patient/prescriptions", icon: ClipboardList },
  { labelKey: "reports", href: "/patient/reports", icon: FileText },
  { labelKey: "profile", href: "/patient/profile", icon: UserRound },
  { labelKey: "support", href: "/patient/support", icon: LifeBuoy },
  { labelKey: "settings", href: "/patient/settings", icon: Settings },
] as const;

export const quickActionItems = [
  { label: "View Token", href: "/patient/token-status", icon: FileClock },
  { label: "View Prescription", href: "/patient/prescriptions", icon: ClipboardList },
  { label: "View Reports", href: "/patient/reports", icon: FileText },
  { label: "Contact Hospital", href: "/patient/support", icon: Activity },
] as const;
