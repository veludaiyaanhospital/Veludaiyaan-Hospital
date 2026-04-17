"use client";

import { useState } from "react";
import { toast } from "sonner";

import { ReportCard } from "@/components/patient/report-card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useReports } from "@/hooks/use-patient-queries";
import type { Report } from "@/lib/types";
import { formatDateTime } from "@/lib/utils";

export default function ReportsPage() {
  const reportsQuery = useReports();

  const [typeFilter, setTypeFilter] = useState<"All" | Report["type"]>("All");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);

  if (reportsQuery.isLoading) {
    return <LoadingSkeleton />;
  }

  if (reportsQuery.isError || !reportsQuery.data) {
    return (
      <ErrorState
        description="Please retry after a moment."
        title="Unable to load reports"
      />
    );
  }

  const reports = reportsQuery.data;

  const filtered = reports.filter((report) => {
    const typeMatches = typeFilter === "All" || report.type === typeFilter;
    const dateMatches = !dateFilter || report.orderedDate.startsWith(dateFilter);
    return typeMatches && dateMatches;
  });

  return (
    <div className="space-y-4">
      <div className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="reportType">Report Type</Label>
          <Select onValueChange={(value: "All" | Report["type"]) => setTypeFilter(value)} value={typeFilter}>
            <SelectTrigger id="reportType">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All</SelectItem>
              <SelectItem value="Lab">Lab</SelectItem>
              <SelectItem value="Imaging">Imaging</SelectItem>
              <SelectItem value="Cardio">Cardio</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="reportDate">Date</Label>
          <Input id="reportDate" onChange={(event) => setDateFilter(event.target.value)} type="date" value={dateFilter} />
        </div>
      </div>

      {filtered.length ? (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((report) => (
            <ReportCard
              key={report.id}
              onDownload={(item) => {
                if (!item.fileUrl) {
                  toast.error("Report file is not available right now.");
                  return;
                }
                window.open(item.fileUrl, "_blank", "noopener,noreferrer");
              }}
              onView={setSelectedReport}
              report={report}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          description="Try adjusting report filters"
          title="No reports match your current filter"
        />
      )}

      <Dialog onOpenChange={(open) => !open && setSelectedReport(null)} open={Boolean(selectedReport)}>
        <DialogContent>
          {selectedReport ? (
            <>
              <DialogHeader>
                <DialogTitle>{selectedReport.testName}</DialogTitle>
                <DialogDescription>
                  {selectedReport.type} | Updated {formatDateTime(selectedReport.updatedDate)}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">Mock Preview Summary</p>
                <p className="text-sm text-slate-700">{selectedReport.previewSummary}</p>
                <p className="text-xs text-slate-500">
                  Final report preview will be rendered from secure file endpoint during HMS integration.
                </p>
              </div>
            </>
          ) : null}
        </DialogContent>
      </Dialog>
    </div>
  );
}
