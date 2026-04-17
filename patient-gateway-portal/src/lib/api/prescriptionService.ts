import { mockPrescriptions } from "@/lib/mock/patient-data";
import type { Prescription } from "@/lib/types";

import { fetchGateway, hasRemoteGateway, withMockLatency } from "./client";

export const prescriptionService = {
  async getPrescriptions(): Promise<Prescription[]> {
    if (hasRemoteGateway()) {
      return fetchGateway<Prescription[]>("/patient/prescriptions");
    }

    return (await withMockLatency(() => structuredClone(mockPrescriptions), { delayMs: 700 })).data;
  },
};
