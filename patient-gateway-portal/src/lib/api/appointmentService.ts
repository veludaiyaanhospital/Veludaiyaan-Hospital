import { mockAppointments } from "@/lib/mock/patient-data";
import type { Appointment } from "@/lib/types";

import { withMockLatency } from "./client";

export const appointmentService = {
  async getAppointments(): Promise<Appointment[]> {
    return (await withMockLatency(() => structuredClone(mockAppointments), { delayMs: 650 })).data;
  },
};
