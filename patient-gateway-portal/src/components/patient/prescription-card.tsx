import { Download, Eye, Share2 } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import type { Prescription } from "@/lib/types";

interface PrescriptionCardProps {
  prescription: Prescription;
  onView?: (id: string) => void;
  onDownload?: (id: string) => void;
  onShare?: (id: string) => void;
}

export function PrescriptionCard({
  prescription,
  onView,
  onDownload,
  onShare,
}: PrescriptionCardProps) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{prescription.doctorName}</CardTitle>
          <Badge variant={prescription.status === "Ready" ? "success" : "warning"}>{prescription.status}</Badge>
        </div>
        <p className="text-sm text-slate-600">
          {prescription.department} | {formatDate(prescription.visitDate)}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-slate-700">{prescription.diagnosisSummary}</p>

        <div className="space-y-2 rounded-xl border border-slate-200 bg-slate-50 p-3">
          {prescription.medicines.map((medicine, index) => (
            <div className="text-sm text-slate-700" key={`${prescription.id}-${medicine.medicine}-${index}`}>
              <p className="font-semibold">{medicine.medicine}</p>
              <p className="text-xs text-slate-600">
                {medicine.dosage} | {medicine.duration} | {medicine.instructions}
              </p>
            </div>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          <Button onClick={() => onView?.(prescription.id)} size="sm" variant="outline">
            <Eye className="h-4 w-4" />
            View
          </Button>
          <Button onClick={() => onDownload?.(prescription.id)} size="sm" variant="outline">
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
          <Button onClick={() => onShare?.(prescription.id)} size="sm" variant="ghost">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
