"use client";

import { motion } from "framer-motion";
import {
  ArrowRight,
  Calendar,
  FileText,
  Stethoscope,
  UsersRound,
} from "lucide-react";
import Link from "next/link";

import { quickActionItems } from "@/components/patient/nav-config";
import { PatientSummaryCards } from "@/components/patient/patient-summary-cards";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import {
  useAppointments,
  useCurrentPatient,
  usePrescriptions,
  useReports,
  useTokenStatus,
  useVisitHistory,
} from "@/hooks/use-patient-queries";
import { formatDate, formatDateTime } from "@/lib/utils";

export default function DashboardPage() {
  const patientQuery = useCurrentPatient();
  const tokenQuery = useTokenStatus();
  const appointmentsQuery = useAppointments();
  const prescriptionsQuery = usePrescriptions();
  const reportsQuery = useReports();
  const visitHistoryQuery = useVisitHistory();

  if (
    patientQuery.isLoading ||
    tokenQuery.isLoading ||
    appointmentsQuery.isLoading ||
    prescriptionsQuery.isLoading ||
    reportsQuery.isLoading
  ) {
    return <LoadingSkeleton />;
  }

  if (
    patientQuery.isError ||
    tokenQuery.isError ||
    appointmentsQuery.isError ||
    prescriptionsQuery.isError ||
    reportsQuery.isError
  ) {
    return (
      <ErrorState
        description="Please retry after a moment."
        title="Unable to load patient dashboard"
      />
    );
  }

  if (!patientQuery.data || !tokenQuery.data) {
    return (
      <ErrorState
        description="Patient data is unavailable right now."
        title="Unable to load patient dashboard"
      />
    );
  }

  const patient = patientQuery.data;
  const tokenStatus = tokenQuery.data;
  const appointments = appointmentsQuery.data ?? [];
  const prescriptions = prescriptionsQuery.data ?? [];
  const reports = reportsQuery.data ?? [];
  const visitHistory = visitHistoryQuery.data ?? [];

  const latestPrescription = prescriptions[0];
  const reportsReady = reports.filter((report) => report.status !== "Processing");
  const nextAppointment = appointments.find((appointment) => appointment.status === "Booked") ?? appointments[0];

  return (
    <div className="space-y-6">
      <motion.section
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
        initial={{ opacity: 0, y: 16 }}
      >
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm text-slate-600">Veludaiyaan Hospital Patient Gateway</p>
            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              Welcome, {patient.firstName} {patient.lastName}
            </h2>
            <div className="mt-2 flex flex-wrap gap-2 text-xs text-slate-600">
              <Badge variant="outline">UHID {patient.uhid}</Badge>
              <Badge variant="outline">{patient.department}</Badge>
              <Badge variant="outline">Primary Doctor: {patient.primaryDoctor}</Badge>
            </div>
          </div>
          <div className="rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm text-teal-800">
            Next follow-up: <span className="font-semibold">{formatDateTime(patient.nextFollowUp)}</span>
          </div>
        </div>
      </motion.section>

      <PatientSummaryCards
        appointments={appointments}
        patient={patient}
        prescriptions={prescriptions}
        reports={reports}
        tokenStatus={tokenStatus}
      />

      <section className="grid gap-4">
        <Card className="rounded-2xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {quickActionItems.map((action) => {
              const Icon = action.icon;

              return (
                <Link
                  className="group flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 hover:border-sky-200 hover:bg-sky-50"
                  href={action.href}
                  key={action.href}
                >
                  <span className="flex items-center gap-2">
                    <Icon className="h-4 w-4 text-sky-600" />
                    {action.label}
                  </span>
                  <ArrowRight className="h-4 w-4 text-slate-400 transition-transform group-hover:translate-x-0.5" />
                </Link>
              );
            })}
          </CardContent>
        </Card>
      </section>

      <section className="grid gap-4 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="rounded-2xl xl:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Today&apos;s Visit</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-700">
            {nextAppointment ? (
              <>
                <p className="flex items-center gap-2 font-semibold text-slate-900">
                  <Stethoscope className="h-4 w-4 text-sky-600" />
                  {nextAppointment.doctorName}
                </p>
                <p className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-teal-600" />
                  {formatDateTime(nextAppointment.dateTime)}
                </p>
                <p>{nextAppointment.department}</p>
              </>
            ) : (
              <EmptyState
                description="Book your next consultation from appointments section"
                title="No visit scheduled"
              />
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Recent Prescription</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-700">
            {latestPrescription ? (
              <>
                <p className="font-semibold text-slate-900">{latestPrescription.doctorName}</p>
                <p>{formatDate(latestPrescription.visitDate)}</p>
                <p className="line-clamp-2">{latestPrescription.diagnosisSummary}</p>
                <Button asChild size="sm" variant="outline">
                  <Link href="/patient/prescriptions">
                    <FileText className="h-4 w-4" />
                    Open Prescriptions
                  </Link>
                </Button>
              </>
            ) : (
              <EmptyState title="No prescription found" description="New prescriptions will appear here" />
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Reports Ready</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-700">
            {reportsReady.length ? (
              <>
                <p className="text-3xl font-bold text-slate-900">{reportsReady.length}</p>
                <p>{reports.length - reportsReady.length} report(s) processing</p>
                <Button asChild size="sm" variant="outline">
                  <Link href="/patient/reports">
                    <UsersRound className="h-4 w-4" />
                    View Reports
                  </Link>
                </Button>
              </>
            ) : (
              <EmptyState
                description="Lab and imaging updates will appear here"
                title="No reports ready"
              />
            )}
          </CardContent>
        </Card>
      </section>

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle className="text-base">Visit History</CardTitle>
        </CardHeader>
        <CardContent>
          {visitHistory.length ? (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {visitHistory.map((visit) => (
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4" key={visit.id}>
                  <p className="text-sm font-semibold text-slate-900">{visit.doctorName}</p>
                  <p className="text-xs text-slate-600">{visit.department} | {formatDateTime(visit.dateTime)}</p>
                  <p className="mt-2 text-sm text-slate-700">{visit.outcome}</p>
                </div>
              ))}
            </div>
          ) : (
            <EmptyState title="No visit history" description="Completed visits will appear here" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
