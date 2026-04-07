"use client";

import { BellRing, Globe2, Lock } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import type { NotificationSettings } from "@/lib/types";

interface NotificationSettingsProps {
  settings: NotificationSettings;
  onChange: (patch: Partial<NotificationSettings>) => void;
}

function ToggleRow({
  id,
  title,
  description,
  checked,
  onCheckedChange,
}: {
  id: string;
  title: string;
  description: string;
  checked: boolean;
  onCheckedChange: (value: boolean) => void;
}) {
  return (
    <div className="flex items-start justify-between gap-3 py-2">
      <div>
        <Label className="text-sm font-semibold text-slate-800" htmlFor={id}>
          {title}
        </Label>
        <p className="text-xs text-slate-600">{description}</p>
      </div>
      <Switch checked={checked} id={id} onCheckedChange={onCheckedChange} />
    </div>
  );
}

export function NotificationSettings({ settings, onChange }: NotificationSettingsProps) {
  return (
    <Card className="rounded-2xl">
      <CardHeader>
        <CardTitle>Notification & Privacy Controls</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <Globe2 className="h-4 w-4 text-sky-600" />
            Language
          </div>
          <Select
            onValueChange={(value: "en" | "ta") => onChange({ language: value })}
            value={settings.language}
          >
            <SelectTrigger className="max-w-xs">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="ta">Tamil</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Separator />

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <BellRing className="h-4 w-4 text-sky-600" />
            Alerts
          </div>
          <ToggleRow
            checked={settings.sms}
            description="Receive SMS alerts for appointments and token updates"
            id="sms"
            onCheckedChange={(value) => onChange({ sms: value })}
            title="SMS Notifications"
          />
          <ToggleRow
            checked={settings.whatsapp}
            description="Receive quick updates via WhatsApp"
            id="whatsapp"
            onCheckedChange={(value) => onChange({ whatsapp: value })}
            title="WhatsApp Notifications"
          />
          <ToggleRow
            checked={settings.email}
            description="Receive reports and receipts by email"
            id="email"
            onCheckedChange={(value) => onChange({ email: value })}
            title="Email Notifications"
          />
          <ToggleRow
            checked={settings.appointmentReminders}
            description="Reminder alerts before appointments"
            id="appointmentReminders"
            onCheckedChange={(value) => onChange({ appointmentReminders: value })}
            title="Appointment Reminders"
          />
          <ToggleRow
            checked={settings.reportAlerts}
            description="Get notified when reports are ready"
            id="reportAlerts"
            onCheckedChange={(value) => onChange({ reportAlerts: value })}
            title="Report Alerts"
          />
        </div>

        <Separator />

        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-semibold text-slate-800">
            <Lock className="h-4 w-4 text-sky-600" />
            Privacy
          </div>
          <Select
            onValueChange={(value: "private" | "care-team-only") => onChange({ profileVisibility: value })}
            value={settings.profileVisibility}
          >
            <SelectTrigger className="max-w-xs">
              <SelectValue placeholder="Select profile visibility" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="private">Private</SelectItem>
              <SelectItem value="care-team-only">Care Team Only</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
}

