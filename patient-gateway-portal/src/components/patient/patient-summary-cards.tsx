"use client";

import { motion } from "framer-motion";
import {
  Activity,
  CalendarClock,
  ClipboardCheck,
  FileCheck2,
  HeartPulse,
  Stethoscope,
  Timer,
  UsersRound,
} from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import type { Appointment, Patient, Prescription, Report, TokenStatus } from "@/lib/types";

interface PatientSummaryCardsProps {
  patient: Patient;
  tokenStatus: TokenStatus;
  appointments: Appointment[];
  prescriptions: Prescription[];
  reports: Report[];
}

function SummaryCard({
  title,
  value,
  caption,
  icon,
  delay,
}: {
  title: string;
  value: string;
  caption: string;
  icon: React.ReactNode;
  delay: number;
}) {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 14 }}
      transition={{ duration: 0.35, delay }}
    >
      <Card className="rounded-2xl">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{title}</p>
              <p className="mt-2 break-words text-lg font-bold leading-tight text-slate-900 sm:text-2xl">{value}</p>
              <p className="mt-1 break-words text-xs text-slate-600">{caption}</p>
            </div>
            <div className="rounded-xl bg-sky-50 p-2 text-sky-700">{icon}</div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export function PatientSummaryCards({
  patient,
  tokenStatus,
  appointments,
  prescriptions,
  reports,
}: PatientSummaryCardsProps) {
  const nextAppointment = appointments.find((item) => item.status === "Booked") ?? appointments[0];
  const latestPrescription = prescriptions[0];
  const readyReports = reports.filter((item) => item.status !== "Processing").length;

  return (
    <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <SummaryCard
        caption={`Queue position ${tokenStatus.queuePosition}`}
        delay={0.03}
        icon={<Activity className="h-5 w-5" />}
        title="Current Token"
        value={tokenStatus.tokenNumber}
      />
      <SummaryCard
        caption={`${tokenStatus.patientsAhead} patients ahead`}
        delay={0.08}
        icon={<UsersRound className="h-5 w-5" />}
        title="Queue"
        value={tokenStatus.isNext ? "You are next" : `${tokenStatus.estimatedWaitMinutes} min`}
      />
      <SummaryCard
        caption={nextAppointment ? `${nextAppointment.department}` : "No upcoming appointment"}
        delay={0.12}
        icon={<CalendarClock className="h-5 w-5" />}
        title="Appointment"
        value={nextAppointment ? nextAppointment.doctorName : "Not scheduled"}
      />
      <SummaryCard
        caption={`Follow-up ${new Date(patient.nextFollowUp).toLocaleDateString("en-IN")}`}
        delay={0.16}
        icon={<Stethoscope className="h-5 w-5" />}
        title="Doctor"
        value={patient.primaryDoctor}
      />
      <SummaryCard
        caption={latestPrescription?.department ?? "No recent prescription"}
        delay={0.2}
        icon={<ClipboardCheck className="h-5 w-5" />}
        title="Prescription Status"
        value={latestPrescription?.status ?? "Pending"}
      />
      <SummaryCard
        caption={`${reports.length} reports in timeline`}
        delay={0.24}
        icon={<FileCheck2 className="h-5 w-5" />}
        title="Reports Ready"
        value={`${readyReports}/${reports.length}`}
      />
      <SummaryCard
        caption="Clinical progress"
        delay={0.28}
        icon={<HeartPulse className="h-5 w-5" />}
        title="Recovery"
        value="Stable"
      />
      <SummaryCard
        caption={`Room ${tokenStatus.consultationRoom}`}
        delay={0.32}
        icon={<Timer className="h-5 w-5" />}
        title="Live Wait"
        value={`${tokenStatus.estimatedWaitMinutes} min`}
      />
    </section>
  );
}
