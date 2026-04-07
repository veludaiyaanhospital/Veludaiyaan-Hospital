import { Download, Eye } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";
import type { Report } from "@/lib/types";

interface ReportCardProps {
  report: Report;
  onView: (report: Report) => void;
  onDownload: (report: Report) => void;
}

const statusVariant: Record<Report["status"], "warning" | "success" | "secondary"> = {
  Processing: "warning",
  Ready: "success",
  Reviewed: "secondary",
};

export function ReportCard({ report, onView, onDownload }: ReportCardProps) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="space-y-4 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">{report.testName}</p>
            <p className="text-xs text-slate-600">{report.type}</p>
          </div>
          <Badge className="shrink-0" variant={statusVariant[report.status]}>
            {report.status}
          </Badge>
        </div>

        <div className="text-xs text-slate-600">
          <p>Ordered: {formatDateTime(report.orderedDate)}</p>
          <p>Updated: {formatDateTime(report.updatedDate)}</p>
        </div>

        <p className="text-sm text-slate-700">{report.previewSummary}</p>

        <div className="grid gap-2 sm:grid-cols-2">
          <Button className="justify-start sm:justify-center" onClick={() => onView(report)} size="sm" variant="outline">
            <Eye className="h-4 w-4" />
            View Report
          </Button>
          <Button className="justify-start sm:justify-center" onClick={() => onDownload(report)} size="sm" variant="outline">
            <Download className="h-4 w-4" />
            Download
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
