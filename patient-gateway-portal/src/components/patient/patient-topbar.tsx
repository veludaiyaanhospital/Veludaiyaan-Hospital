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
      <div className="flex flex-wrap items-center gap-2 px-3 py-3 sm:gap-3 sm:px-4 lg:px-8">
        <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
          <Sheet>
            <SheetTrigger asChild>
              <Button className="h-9 w-9 lg:hidden" size="icon" variant="outline">
                <Menu className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent className="w-[88%] max-w-xs overflow-y-auto pb-8">
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
                        isActive
                          ? "bg-gradient-to-r from-[#0f4ca0] to-[#06b6d4] text-white"
                          : "text-slate-700 hover:bg-slate-100",
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
          <div className="min-w-0">
            <h1 className="truncate text-base font-semibold text-slate-900 sm:text-lg">{title}</h1>
            {subtitle ? <p className="hidden text-xs text-slate-600 sm:block">{subtitle}</p> : null}
          </div>
        </div>

        <div className="flex w-full items-center justify-end gap-1 sm:w-auto sm:gap-2">
          <Button
            className="h-9 gap-1 px-2 sm:px-3"
            onClick={() => patchSettings({ language: settings.language === "en" ? "ta" : "en" })}
            size="sm"
            variant="outline"
          >
            <Languages className="h-4 w-4" />
            <span className="hidden sm:inline">{settings.language === "en" ? "தமிழ்" : "English"}</span>
            <span className="sr-only sm:hidden">Switch Language</span>
          </Button>
          <Button className="h-9 gap-1 px-2 sm:px-3" onClick={toggleTheme} size="sm" variant="outline">
            {theme === "light" ? <MoonStar className="h-4 w-4" /> : <Sun className="h-4 w-4" />}
            <span className="hidden sm:inline">{theme === "light" ? "Dark" : "Light"}</span>
            <span className="sr-only sm:hidden">Toggle Theme</span>
          </Button>
          <Button
            className="h-9 gap-1 px-2 sm:px-3"
            disabled={logoutMutation.isPending}
            onClick={() => logoutMutation.mutate()}
            size="sm"
            variant="ghost"
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">{copy.logout}</span>
            <span className="sr-only sm:hidden">{copy.logout}</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
