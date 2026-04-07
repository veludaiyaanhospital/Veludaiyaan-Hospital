"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  appointmentService,
  billingService,
  patientService,
  prescriptionService,
  reportService,
  tokenService,
} from "@/lib/api";
import type { Patient, NotificationSettings } from "@/lib/types";

export const patientQueryKeys = {
  patient: ["patient", "current"] as const,
  token: ["patient", "token-status"] as const,
  appointments: ["patient", "appointments"] as const,
  prescriptions: ["patient", "prescriptions"] as const,
  reports: ["patient", "reports"] as const,
  invoices: ["patient", "invoices"] as const,
  outstanding: ["patient", "outstanding"] as const,
  visitHistory: ["patient", "visit-history"] as const,
  notificationSettings: ["patient", "notification-settings"] as const,
};

export function useCurrentPatient(enabled = true) {
  return useQuery({
    queryKey: patientQueryKeys.patient,
    queryFn: () => patientService.getCurrentPatient(),
    enabled,
  });
}

export function useTokenStatus(enabled = true, autoRefresh = false) {
  return useQuery({
    queryKey: patientQueryKeys.token,
    queryFn: () => tokenService.getTokenStatus(),
    refetchInterval: autoRefresh ? 10000 : false,
    enabled,
  });
}

export function useAppointments(enabled = true) {
  return useQuery({
    queryKey: patientQueryKeys.appointments,
    queryFn: () => appointmentService.getAppointments(),
    enabled,
  });
}

export function usePrescriptions(enabled = true) {
  return useQuery({
    queryKey: patientQueryKeys.prescriptions,
    queryFn: () => prescriptionService.getPrescriptions(),
    enabled,
  });
}

export function useReports(enabled = true) {
  return useQuery({
    queryKey: patientQueryKeys.reports,
    queryFn: () => reportService.getReports(),
    enabled,
  });
}

export function useInvoices(enabled = true) {
  return useQuery({
    queryKey: patientQueryKeys.invoices,
    queryFn: () => billingService.getInvoices(),
    enabled,
  });
}

export function useOutstandingAmount(enabled = true) {
  return useQuery({
    queryKey: patientQueryKeys.outstanding,
    queryFn: () => billingService.getOutstandingAmount(),
    enabled,
  });
}

export function useVisitHistory(enabled = true) {
  return useQuery({
    queryKey: patientQueryKeys.visitHistory,
    queryFn: () => patientService.getVisitHistory(),
    enabled,
  });
}

export function useNotificationSettings(enabled = true) {
  return useQuery({
    queryKey: patientQueryKeys.notificationSettings,
    queryFn: () => patientService.getNotificationSettings(),
    enabled,
  });
}

export function useUpdateProfileMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<Patient>) => patientService.updatePatientProfile(payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(patientQueryKeys.patient, updated);
      toast.success("Profile updated successfully");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Unable to update profile now");
    },
  });
}

export function useUpdateNotificationSettingsMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: Partial<NotificationSettings>) =>
      patientService.updateNotificationSettings(payload),
    onSuccess: (updated) => {
      queryClient.setQueryData(patientQueryKeys.notificationSettings, updated);
      toast.success("Settings saved");
    },
    onError: (error: Error) => {
      toast.error(error.message || "Unable to save settings now");
    },
  });
}

export function useSupportMutations() {
  const callbackMutation = useMutation({
    mutationFn: patientService.requestCallback,
    onSuccess: (data) => {
      toast.success(`Callback request submitted (${data.ticketId})`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Unable to submit callback request");
    },
  });

  const ticketMutation = useMutation({
    mutationFn: patientService.createSupportTicket,
    onSuccess: (data) => {
      toast.success(`Ticket submitted (${data.ticketId})`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Unable to submit ticket");
    },
  });

  return {
    callbackMutation,
    ticketMutation,
  };
}

