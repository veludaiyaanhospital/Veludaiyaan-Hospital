import { CalendarDays, Clock3, Stethoscope } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDateTime } from "@/lib/utils";
import type { Appointment } from "@/lib/types";

const statusVariant: Record<Appointment["status"], "default" | "warning" | "success"> = {
  Visit: "default",
  Waiting: "warning",
  Seen: "success",
};

export function AppointmentCard({ appointment }: { appointment: Appointment }) {
  return (
    <Card className="rounded-2xl">
      <CardContent className="space-y-4 p-5">
        <div className="flex flex-wrap items-start justify-between gap-2">
          <p className="min-w-0 break-words text-sm font-semibold text-slate-900">{appointment.doctorName}</p>
          <Badge className="shrink-0" variant={statusVariant[appointment.status]}>
            {appointment.status}
          </Badge>
        </div>
        <div className="grid gap-2 text-sm text-slate-600">
          <p className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-sky-600" />
            {formatDateTime(appointment.dateTime)}
          </p>
          <p className="flex items-center gap-2">
            <Stethoscope className="h-4 w-4 text-teal-600" />
            {appointment.department}
          </p>
          <p className="flex items-center gap-2">
            <Clock3 className="h-4 w-4 text-slate-500" />
            {appointment.mode} | {appointment.type}
          </p>
          {appointment.notes ? <p className="text-xs text-slate-500">{appointment.notes}</p> : null}
        </div>
      </CardContent>
    </Card>
  );
}
