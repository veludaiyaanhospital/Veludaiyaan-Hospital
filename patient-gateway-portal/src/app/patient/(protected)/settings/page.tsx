"use client";

import { useEffect } from "react";

import { NotificationSettings } from "@/components/patient/notification-settings";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ErrorState } from "@/components/ui/error-state";
import { LoadingSkeleton } from "@/components/ui/loading-skeleton";
import { useOtpAuth } from "@/hooks/use-auth";
import {
  useNotificationSettings,
  useUpdateNotificationSettingsMutation,
} from "@/hooks/use-patient-queries";
import { usePatientPreferencesStore } from "@/store/patient-preferences-store";

export default function SettingsPage() {
  const settingsQuery = useNotificationSettings();
  const updateMutation = useUpdateNotificationSettingsMutation();
  const { logoutMutation } = useOtpAuth();

  const localSettings = usePatientPreferencesStore((state) => state.settings);
  const setSettings = usePatientPreferencesStore((state) => state.setSettings);
  const patchSettings = usePatientPreferencesStore((state) => state.patchSettings);

  useEffect(() => {
    if (settingsQuery.data) {
      setSettings(settingsQuery.data);
    }
  }, [settingsQuery.data, setSettings]);

  if (settingsQuery.isLoading) {
    return <LoadingSkeleton />;
  }

  if (settingsQuery.isError) {
    return (
      <ErrorState
        description="Please retry after a moment."
        title="Unable to load notification settings"
      />
    );
  }

  return (
    <div className="space-y-4">
      <NotificationSettings
        onChange={(patch) => {
          patchSettings(patch);
          updateMutation.mutate(patch);
        }}
        settings={localSettings}
      />

      <Card className="rounded-2xl">
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-slate-700">
          <p>
            Change mobile flow: secure OTP re-verification placeholder is ready for backend integration.
          </p>
          <p>
            Privacy controls: final authorization and consent checks must be enforced on server-side APIs.
          </p>
          <div className="flex flex-wrap gap-2">
            <Button disabled variant="outline">Change Mobile (Coming Soon)</Button>
            <Button
              disabled={logoutMutation.isPending}
              onClick={() => logoutMutation.mutate()}
              variant="destructive"
            >
              Logout
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
