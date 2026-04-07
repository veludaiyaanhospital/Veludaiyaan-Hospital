import { RefreshCcw, Timer, Users } from "lucide-react";

import { QueueProgress } from "@/components/patient/queue-progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { formatDateTime } from "@/lib/utils";
import type { TokenStatus } from "@/lib/types";

const statusVariantMap: Record<TokenStatus["status"], "warning" | "default" | "secondary" | "success"> = {
  Waiting: "warning",
  Called: "default",
  "In Consultation": "secondary",
  Completed: "success",
};

interface TokenLiveCardProps {
  tokenStatus: TokenStatus;
  autoRefresh: boolean;
  onAutoRefreshChange: (value: boolean) => void;
  onManualRefresh: () => void;
  isRefreshing: boolean;
}

export function TokenLiveCard({
  tokenStatus,
  autoRefresh,
  onAutoRefreshChange,
  onManualRefresh,
  isRefreshing,
}: TokenLiveCardProps) {
  return (
    <Card className="rounded-2xl">
      <CardHeader className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-xl">Live Token Queue</CardTitle>
          <p className="mt-1 text-sm text-slate-600">Last updated: {formatDateTime(tokenStatus.updatedAt)}</p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2">
            <Switch checked={autoRefresh} onCheckedChange={onAutoRefreshChange} />
            <span className="text-sm text-slate-700">Auto refresh</span>
          </div>
          <Button disabled={isRefreshing} onClick={onManualRefresh} variant="outline">
            <RefreshCcw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="grid gap-4 md:grid-cols-4">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Token No</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{tokenStatus.tokenNumber}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Queue Position</p>
            <p className="mt-2 flex items-center gap-2 text-2xl font-bold text-slate-900">
              <Users className="h-5 w-5 text-sky-600" />
              {tokenStatus.queuePosition}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Patients Ahead</p>
            <p className="mt-2 text-2xl font-bold text-slate-900">{tokenStatus.patientsAhead}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Estimated Wait</p>
            <p className="mt-2 flex items-center gap-2 text-2xl font-bold text-slate-900">
              <Timer className="h-5 w-5 text-teal-600" />
              {tokenStatus.estimatedWaitMinutes} min
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Badge variant={statusVariantMap[tokenStatus.status]}>{tokenStatus.status}</Badge>
          <Badge variant="outline">Room: {tokenStatus.consultationRoom}</Badge>
          {tokenStatus.isNext ? (
            <Badge className="animate-pulse-subtle" variant="default">
              You are next
            </Badge>
          ) : null}
        </div>

        <QueueProgress timeline={tokenStatus.timeline} />
      </CardContent>
    </Card>
  );
}
