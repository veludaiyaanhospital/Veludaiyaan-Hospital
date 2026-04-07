"use client";

import { useState } from "react";

import { TokenLiveCard } from "@/components/patient/token-live-card";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { useTokenStatus } from "@/hooks/use-patient-queries";

export default function TokenStatusPage() {
  const [autoRefresh, setAutoRefresh] = useState(true);
  const tokenQuery = useTokenStatus(true, autoRefresh);

  if (tokenQuery.isLoading) {
    return <LoadingSkeleton />;
  }

  if (tokenQuery.isError || !tokenQuery.data) {
    return (
      <ErrorState
        description="Please retry after a moment."
        title="Unable to load current token status"
      />
    );
  }

  return (
    <div className="space-y-4">
      <TokenLiveCard
        autoRefresh={autoRefresh}
        isRefreshing={tokenQuery.isRefetching}
        onAutoRefreshChange={setAutoRefresh}
        onManualRefresh={() => tokenQuery.refetch()}
        tokenStatus={tokenQuery.data}
      />
    </div>
  );
}
