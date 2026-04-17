import { mockReports } from "@/lib/mock/patient-data";
import type { Report } from "@/lib/types";

import { fetchGateway, hasRemoteGateway, withMockLatency } from "./client";

export const reportService = {
  async getReports(): Promise<Report[]> {
    if (hasRemoteGateway()) {
      return fetchGateway<Report[]>("/patient/reports");
    }

    return (await withMockLatency(() => structuredClone(mockReports), { delayMs: 760 })).data;
  },
};
