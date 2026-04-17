import { mockInvoices } from "@/lib/mock/patient-data";
import type { Invoice } from "@/lib/types";

import { fetchGateway, hasRemoteGateway, withMockLatency } from "./client";

export const billingService = {
  async getInvoices(): Promise<Invoice[]> {
    if (hasRemoteGateway()) {
      return fetchGateway<Invoice[]>("/patient/invoices");
    }

    return (await withMockLatency(() => structuredClone(mockInvoices), { delayMs: 700 })).data;
  },

  async getOutstandingAmount(): Promise<number> {
    if (hasRemoteGateway()) {
      return fetchGateway<number>("/patient/outstanding-amount");
    }

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
