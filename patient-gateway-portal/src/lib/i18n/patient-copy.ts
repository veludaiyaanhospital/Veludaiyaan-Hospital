export type Locale = "en" | "ta";

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
    appName: "Veludaiyaan Hospital Patient Gateway",
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
  ta: {
    appName: "வேலுடையான் மருத்துவமனை நோயாளர் வாயில்",
    dashboard: "டாஷ்போர்டு",
    tokenStatus: "டோக்கன் நிலை",
    appointments: "நேரம்சேர்ப்பு",
    prescriptions: "மருந்து சீட்டுகள்",
    reports: "அறிக்கைகள்",
    profile: "சுயவிவரம்",
    support: "உதவி",
    settings: "அமைப்புகள்",
    welcomeBack: "மீண்டும் வரவேற்கிறோம்",
    quickActions: "விரைவு செயல்கள்",
    logout: "வெளியேறு",
    theme: "தீம்",
    language: "மொழி",
  },
};

export function getCopy(locale: Locale): CopyDictionary {
  return copy[locale] ?? copy.en;
}
