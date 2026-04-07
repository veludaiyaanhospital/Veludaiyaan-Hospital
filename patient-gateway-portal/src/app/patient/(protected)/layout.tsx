"use client";

import { useMemo } from "react";
import { usePathname } from "next/navigation";

import { FloatingWhatsApp } from "@/components/patient/floating-whatsapp";
import { PatientMobileNav } from "@/components/patient/patient-mobile-nav";
import { PatientSidebar } from "@/components/patient/patient-sidebar";
import { PatientTopbar } from "@/components/patient/patient-topbar";
import { ProtectedRoute } from "@/components/patient/protected-route";
import { useCurrentPatient } from "@/hooks/use-patient-queries";

const pageTitles: Record<string, { title: string; subtitle: string }> = {
  "/patient/dashboard": {
    title: "Dashboard",
    subtitle: "Your personal health and visit summary",
  },
  "/patient/token-status": {
    title: "Token Status",
    subtitle: "Live queue tracking for today\'s consultation",
  },
  "/patient/appointments": {
    title: "Appointments",
    subtitle: "Upcoming and recent consultation schedule",
  },
  "/patient/prescriptions": {
    title: "Prescriptions",
    subtitle: "Doctor prescriptions and download records",
  },
  "/patient/reports": {
    title: "Reports",
    subtitle: "Lab and imaging report center",
  },
  "/patient/profile": {
    title: "Profile",
    subtitle: "Personal and emergency contact details",
  },
  "/patient/support": {
    title: "Support",
    subtitle: "Hospital assistance and help tickets",
  },
  "/patient/settings": {
    title: "Settings",
    subtitle: "Language, alerts, and privacy controls",
  },
};

export default function PatientProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { data: patient } = useCurrentPatient();

  const pageMeta = useMemo(() => {
    return pageTitles[pathname] ?? pageTitles["/patient/dashboard"];
  }, [pathname]);

  return (
    <ProtectedRoute>
      <div className="portal-shell min-h-screen overflow-x-clip lg:flex">
        <PatientSidebar patientName={patient ? `${patient.firstName} ${patient.lastName}` : undefined} />
        <div className="flex min-h-screen min-w-0 flex-1 flex-col overflow-x-clip">
          <PatientTopbar subtitle={pageMeta.subtitle} title={pageMeta.title} />
          <main className="flex-1 px-3 py-4 pb-[calc(7rem+env(safe-area-inset-bottom))] sm:px-4 lg:px-8 lg:py-8 lg:pb-8">
            {children}
          </main>
        </div>
        <FloatingWhatsApp />
        <PatientMobileNav />
      </div>
    </ProtectedRoute>
  );
}
