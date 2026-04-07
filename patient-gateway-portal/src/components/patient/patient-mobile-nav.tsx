"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { patientNavItems } from "@/components/patient/nav-config";
import { cn } from "@/lib/utils";

const compactItems = patientNavItems.slice(0, 5);
const compactLabel: Partial<Record<(typeof patientNavItems)[number]["labelKey"], string>> = {
  dashboard: "Home",
  tokenStatus: "Token",
  appointments: "Appt",
  prescriptions: "Rx",
  reports: "Reports",
};

export function PatientMobileNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200 bg-white/95 px-2 pb-[calc(0.5rem+env(safe-area-inset-bottom))] pt-2 shadow-[0_-6px_24px_rgba(15,23,42,0.06)] backdrop-blur lg:hidden">
      <ul className="grid grid-cols-5 gap-1">
        {compactItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <li key={item.href}>
              <Link
                className={cn(
                  "flex min-w-0 flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-[10px] font-semibold",
                  isActive ? "bg-gradient-to-r from-[#0f4ca0] to-[#06b6d4] text-white" : "text-slate-600",
                )}
                href={item.href}
              >
                <Icon className="h-4 w-4" />
                <span className="max-w-full truncate leading-none">{compactLabel[item.labelKey] ?? item.labelKey}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
