export type Locale = "en";

interface CopyDictionary {
  appName: string;
  dashboard: string;
  tokenStatus: string;
  appointments: string;
  prescriptions: string;
  reports: string;
  profile: string;
  support: string;
  settings: string;
  welcomeBack: string;
  quickActions: string;
  logout: string;
  theme: string;
  language: string;
}

const copy: Record<Locale, CopyDictionary> = {
  en: {
    appName: "Veludaiyaan Hospital Patient Portal",
    dashboard: "Dashboard",
    tokenStatus: "Token Status",
    appointments: "Appointments",
    prescriptions: "Prescriptions",
    reports: "Reports",
    profile: "Profile",
    support: "Support",
    settings: "Settings",
    welcomeBack: "Welcome back",
    quickActions: "Quick Actions",
    logout: "Logout",
    theme: "Theme",
    language: "Language",
  },
};

export function getCopy(locale: Locale): CopyDictionary {
  return copy[locale] ?? copy.en;
}

