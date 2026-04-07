import { mockInvoices } from "@/lib/mock/patient-data";
import type { Invoice } from "@/lib/types";

import { withMockLatency } from "./client";

export const billingService = {
  async getInvoices(): Promise<Invoice[]> {
    return (await withMockLatency(() => structuredClone(mockInvoices), { delayMs: 700 })).data;
  },

  async getOutstandingAmount(): Promise<number> {
    return (
      await withMockLatency(
        () =>
          mockInvoices
            .filter((invoice) => invoice.status === "Unpaid")
            .reduce((sum, invoice) => sum + invoice.amount, 0),
        { delayMs: 500 },
      )
    ).data;
  },
};
