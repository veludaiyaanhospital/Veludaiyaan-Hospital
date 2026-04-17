import { mockTokenStatus } from "@/lib/mock/patient-data";
import type { TokenStage, TokenStatus } from "@/lib/types";

import { fetchGateway, hasRemoteGateway, withMockLatency } from "./client";

let mutableTokenStatus: TokenStatus = structuredClone(mockTokenStatus);

function stageFromPosition(position: number): TokenStage {
  if (position <= 0) return "Seen";
  if (position <= 2) return "Waiting";
  return "Visit";
}

export const tokenService = {
  async getTokenStatus(): Promise<TokenStatus> {
    if (hasRemoteGateway()) {
      return fetchGateway<TokenStatus>("/patient/token-status");
    }

    return (
      await withMockLatency(() => {
        const movement = Math.random() > 0.55 ? 1 : 0;
        const nextPosition = Math.max(0, mutableTokenStatus.queuePosition - movement);
        mutableTokenStatus = {
          ...mutableTokenStatus,
          queuePosition: nextPosition,
          patientsAhead: Math.max(0, nextPosition - 1),
          estimatedWaitMinutes: nextPosition === 0 ? 0 : nextPosition * 6,
          isNext: nextPosition === 1,
          status: stageFromPosition(nextPosition),
          updatedAt: new Date().toISOString(),
        };

        const stageOrder: TokenStage[] = ["Visit", "Waiting", "Seen"];
        const currentStageIndex = stageOrder.indexOf(mutableTokenStatus.status);
        const nowLabel = new Date().toLocaleTimeString("en-IN", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });

        mutableTokenStatus.timeline = mutableTokenStatus.timeline.map((item) => {
          const itemIndex = stageOrder.indexOf(item.stage);
          const isCurrent = itemIndex === currentStageIndex;
          const isCompleted = itemIndex < currentStageIndex || mutableTokenStatus.status === "Seen";

          return {
            ...item,
            completed: isCompleted,
            current: isCurrent,
            timestamp: isCurrent && !item.timestamp ? nowLabel : item.timestamp,
          };
        });

        return structuredClone(mutableTokenStatus);
      }, { delayMs: 650 })
    ).data;
  },
};
