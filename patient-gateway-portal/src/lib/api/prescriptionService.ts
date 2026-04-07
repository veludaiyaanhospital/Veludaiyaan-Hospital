import { mockPrescriptions } from "@/lib/mock/patient-data";
import type { Prescription } from "@/lib/types";

import { withMockLatency } from "./client";

export const prescriptionService = {
  async getPrescriptions(): Promise<Prescription[]> {
    return (await withMockLatency(() => structuredClone(mockPrescriptions), { delayMs: 700 })).data;
  },
};
