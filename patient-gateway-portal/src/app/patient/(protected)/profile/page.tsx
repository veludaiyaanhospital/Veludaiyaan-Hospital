"use client";

import { ProfileForm } from "@/components/patient/profile-form";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { useCurrentPatient, useUpdateProfileMutation } from "@/hooks/use-patient-queries";

export default function ProfilePage() {
  const patientQuery = useCurrentPatient();
  const updateProfileMutation = useUpdateProfileMutation();

  if (patientQuery.isLoading) {
    return <LoadingSkeleton />;
  }

  if (patientQuery.isError || !patientQuery.data) {
    return (
      <ErrorState
        description="Please retry after a moment."
        title="Unable to load patient profile"
      />
    );
  }

  const patient = patientQuery.data;

  return (
    <div className="space-y-4">
      <Card className="rounded-2xl">
        <CardContent className="flex flex-wrap items-center gap-4 p-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900">{patient.firstName} {patient.lastName}</h2>
            <p className="text-sm text-slate-600">UHID: {patient.uhid}</p>
            <div className="mt-2 flex flex-wrap gap-2">
              <Badge variant="outline">{patient.bloodGroup}</Badge>
              <Badge variant="outline">{patient.sex}, {patient.age} years</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <ProfileForm
        isSaving={updateProfileMutation.isPending}
        onSubmit={(values) => updateProfileMutation.mutate(values)}
        patient={patient}
      />
    </div>
  );
}
