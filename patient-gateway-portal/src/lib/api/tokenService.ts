import { mockTokenStatus } from "@/lib/mock/patient-data";
import type { TokenStage, TokenStatus } from "@/lib/types";

import { withMockLatency } from "./client";

let mutableTokenStatus: TokenStatus = structuredClone(mockTokenStatus);

function stageFromPosition(position: number): TokenStage {
  if (position <= 0) return "Completed";
  if (position === 1) return "Called";
  return "Waiting";
}

export const tokenService = {
  async getTokenStatus(): Promise<TokenStatus> {
    return (
      await withMockLatency(() => {
        const movement = Math.random() > 0.55 ? 1 : 0;
        const nextPosition = Math.max(0, mutableTokenStatus.queuePosition - movement);
        const isConsultation = nextPosition === 0 && Math.random() > 0.6;

        mutableTokenStatus = {
          ...mutableTokenStatus,
          queuePosition: nextPosition,
          patientsAhead: Math.max(0, nextPosition - 1),
          estimatedWaitMinutes: nextPosition === 0 ? 0 : nextPosition * 6,
          isNext: nextPosition === 1,
          status: isConsultation ? "In Consultation" : stageFromPosition(nextPosition),
          updatedAt: new Date().toISOString(),
        };

        if (mutableTokenStatus.status === "Completed") {
          mutableTokenStatus.timeline = mutableTokenStatus.timeline.map((item) => ({
            ...item,
            completed: true,
            current: item.stage === "Completed",
          }));
        }

        return structuredClone(mutableTokenStatus);
      }, { delayMs: 650 })
    ).data;
  },
};
