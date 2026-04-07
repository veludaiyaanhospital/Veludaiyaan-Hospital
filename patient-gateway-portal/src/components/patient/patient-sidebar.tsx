"use client";

import { Hospital } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { patientNavItems } from "@/components/patient/nav-config";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { getCopy } from "@/lib/i18n/patient-copy";
import { usePatientPreferencesStore } from "@/store/patient-preferences-store";

interface PatientSidebarProps {
  patientName?: string;
}

export function PatientSidebar({ patientName }: PatientSidebarProps) {
  const pathname = usePathname();
  const language = usePatientPreferencesStore((state) => state.settings.language);
  const copy = getCopy(language);

  return (
    <aside className="hidden w-72 shrink-0 border-r border-slate-200 bg-white/95 px-5 py-6 lg:flex lg:flex-col">
      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-sky-100 p-2 text-sky-700">
            <Hospital className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">Veludaiyaan Hospital</p>
            <p className="text-xs text-slate-600">Ortho & Trauma Speciality</p>
            {patientName ? <Badge className="mt-2">{patientName}</Badge> : null}
          </div>
        </div>
      </div>

      <nav className="mt-5 space-y-1">
        {patientNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              className={cn(
                "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                isActive
                  ? "bg-sky-600 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100 hover:text-slate-900",
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

      <div className="mt-auto rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">Emergency</p>
        <p className="mt-1 text-base font-bold text-teal-800">24x7 +91 78459 27606</p>
      </div>
    </aside>
  );
}
