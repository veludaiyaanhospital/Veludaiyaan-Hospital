import {
  mockNotificationSettings,
  mockPatient,
  mockVisitHistory,
} from "@/lib/mock/patient-data";
import type {
  CallbackRequestPayload,
  Patient,
  NotificationSettings,
  SupportTicket,
  VisitHistoryItem,
} from "@/lib/types";

import { fetchGateway, hasRemoteGateway, withMockLatency } from "./client";

let mutablePatient: Patient = structuredClone(mockPatient);
let mutableSettings: NotificationSettings = structuredClone(mockNotificationSettings);

export const patientService = {
  async getCurrentPatient(): Promise<Patient> {
    if (hasRemoteGateway()) {
      return fetchGateway<Patient>("/patient/me");
    }

    // SECURITY NOTE: Object-level authorization must be enforced server-side for every patient record request.
    return (await withMockLatency(() => structuredClone(mutablePatient), { delayMs: 700 })).data;
  },

  async updatePatientProfile(payload: Partial<Patient>): Promise<Patient> {
    if (hasRemoteGateway()) {
      return fetchGateway<Patient>("/patient/me", {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
    }

    return (
      await withMockLatency(() => {
        // SECURITY NOTE: Never trust patient ID coming directly from client. Resolve patient identity from validated server session.
        mutablePatient = {
          ...mutablePatient,
          ...payload,
        };

        return structuredClone(mutablePatient);
      }, { delayMs: 850 })
    ).data;
  },

  async getVisitHistory(): Promise<VisitHistoryItem[]> {
    if (hasRemoteGateway()) {
      return fetchGateway<VisitHistoryItem[]>("/patient/visit-history");
    }

    return (await withMockLatency(() => structuredClone(mockVisitHistory), { delayMs: 550 })).data;
  },

  async getNotificationSettings(): Promise<NotificationSettings> {
    if (hasRemoteGateway()) {
      return fetchGateway<NotificationSettings>("/patient/notification-settings");
    }

    return (await withMockLatency(() => structuredClone(mutableSettings), { delayMs: 450 })).data;
  },

  async updateNotificationSettings(
    payload: Partial<NotificationSettings>,
  ): Promise<NotificationSettings> {
    if (hasRemoteGateway()) {
      return fetchGateway<NotificationSettings>("/patient/notification-settings", {
        method: "PATCH",
        body: JSON.stringify(payload),
      });
    }

    return (
      await withMockLatency(() => {
        mutableSettings = {
          ...mutableSettings,
          ...payload,
        };

        return structuredClone(mutableSettings);
      }, { delayMs: 600 })
    ).data;
  },

  async requestCallback(payload: CallbackRequestPayload): Promise<{ ticketId: string }> {
    if (hasRemoteGateway()) {
      return fetchGateway<{ ticketId: string }>("/patient/callback-request", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    }

    return (
      await withMockLatency(() => {
        if (!payload.mobile || !payload.reason || !payload.preferredSlot) {
          throw new Error("Please complete all callback request fields.");
        }

        return {
          ticketId: `CALLBACK-${Date.now()}`,
        };
      }, { delayMs: 900 })
    ).data;
  },

  async createSupportTicket(payload: SupportTicket): Promise<{ ticketId: string }> {
    if (hasRemoteGateway()) {
      return fetchGateway<{ ticketId: string }>("/patient/support-ticket", {
        method: "POST",
        body: JSON.stringify(payload),
      });
    }

    return (
      await withMockLatency(() => {
        if (!payload.subject || !payload.message) {
          throw new Error("Please provide ticket subject and message.");
        }

        return {
          ticketId: `SUP-${Date.now()}`,
        };
      }, { delayMs: 800 })
    ).data;
  },
};

