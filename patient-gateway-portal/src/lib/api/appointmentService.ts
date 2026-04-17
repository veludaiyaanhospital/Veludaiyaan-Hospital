import { mockAppointments } from "@/lib/mock/patient-data";
import type { Appointment } from "@/lib/types";

import { fetchGateway, hasRemoteGateway, withMockLatency } from "./client";

export const appointmentService = {
  async getAppointments(): Promise<Appointment[]> {
    if (hasRemoteGateway()) {
      return fetchGateway<Appointment[]>("/patient/appointments");
    }

    return (await withMockLatency(() => structuredClone(mockAppointments), { delayMs: 650 })).data;
  },
};
