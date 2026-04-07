"use client";

import { toast } from "sonner";

import { PrescriptionCard } from "@/components/patient/prescription-card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { usePrescriptions } from "@/hooks/use-patient-queries";

export default function PrescriptionsPage() {
  const prescriptionsQuery = usePrescriptions();

  if (prescriptionsQuery.isLoading) {
    return <LoadingSkeleton />;
  }

  if (prescriptionsQuery.isError || !prescriptionsQuery.data) {
    return (
      <ErrorState
        description="Please retry after a moment."
        title="Unable to load prescriptions"
      />
    );
  }

  const prescriptions = prescriptionsQuery.data;

  if (!prescriptions.length) {
    return (
      <EmptyState
        description="Doctor-issued prescriptions will appear after consultation"
        title="No prescriptions available"
      />
    );
  }

  return (
    <div className="grid gap-4 lg:grid-cols-2">
      {prescriptions.map((prescription) => (
        <PrescriptionCard
          key={prescription.id}
          onDownload={() => toast.success("PDF download endpoint will be connected in HMS integration")}
          onShare={() => toast.success("Secure share flow will be connected from backend")}
          onView={() => toast.success("Prescription detail viewer can be mapped to HMS PDF endpoint")}
          prescription={prescription}
        />
      ))}
    </div>
  );
}
