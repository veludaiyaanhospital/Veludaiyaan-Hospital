"use client";

import {
  Languages,
  LogOut,
  Menu,
  MoonStar,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";

import { patientNavItems } from "@/components/patient/nav-config";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { getCopy } from "@/lib/i18n/patient-copy";
import { useOtpAuth } from "@/hooks/use-auth";
import { usePatientPreferencesStore } from "@/store/patient-preferences-store";

interface PatientTopbarProps {
  title: string;
  subtitle?: string;
}

export function PatientTopbar({ title, subtitle }: PatientTopbarProps) {
  const pathname = usePathname();
  const { logoutMutation } = useOtpAuth();

  const settings = usePatientPreferencesStore((state) => state.settings);
  const patchSettings = usePatientPreferencesStore((state) => state.patchSettings);
  const theme = usePatientPreferencesStore((state) => state.theme);
  const toggleTheme = usePatientPreferencesStore((state) => state.toggleTheme);

  const copy = getCopy(settings.language);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
      root.style.colorScheme = "dark";
    } else {
      root.classList.remove("dark");
      root.style.colorScheme = "light";
    }
  }, [theme]);

  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/90 backdrop-blur">
      <div className="flex items-center justify-between gap-3 px-4 py-3 lg:px-8">
        <div className="flex items-center gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button className="lg:hidden" size="icon" variant="outline">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent>
              <SheetHeader>
                <SheetTitle>{copy.appName}</SheetTitle>
              </SheetHeader>
              <nav className="mt-4 space-y-1">
                {patientNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      className={cn(
                        "flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium",
                        isActive ? "bg-sky-600 text-white" : "text-slate-700 hover:bg-slate-100",
                      )}
                      href={item.href}
                      key={item.href}
                    >
                      <Icon className="h-4 w-4" />
                      {copy[item.labelKey]}
                    </Link>
                  );
                })}
              </nav>
            </SheetContent>
          </Sheet>
          <div>
            <h1 className="text-lg font-semibold text-slate-900">{title}</h1>
            {subtitle ? <p className="text-xs text-slate-600">{subtitle}</p> : null}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            onClick={() => patchSettings({ language: settings.language === "en" ? "ta" : "en" })}
            size="sm"
            variant="outline"
          >
            <Languages className="h-4 w-4" />
            {settings.language === "en" ? "தமிழ்" : "English"}
          </Button>
          <Button onClick={toggleTheme} size="sm" variant="outline">
            {theme === "light" ? <MoonStar className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            {theme === "light" ? "Dark" : "Light"}
          </Button>
          <Button
            disabled={logoutMutation.isPending}
            onClick={() => logoutMutation.mutate()}
            size="sm"
            variant="ghost"
          >
            <LogOut className="h-4 w-4" />
            {copy.logout}
          </Button>
        </div>
      </div>
    </header>
  );
}
