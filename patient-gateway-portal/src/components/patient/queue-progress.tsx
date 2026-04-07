import { CheckCircle2, Circle } from "lucide-react";

import { cn } from "@/lib/utils";
import type { TokenStatus } from "@/lib/types";

export function QueueProgress({ timeline }: { timeline: TokenStatus["timeline"] }) {
  return (
    <ol className="space-y-4">
      {timeline.map((step, index) => (
        <li className="flex gap-3" key={`${step.label}-${index}`}>
          <div className="mt-0.5">
            {step.completed ? (
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
            ) : (
              <Circle className={cn("h-5 w-5 text-slate-300", step.current && "text-sky-600")} />
            )}
          </div>
          <div>
            <p className={cn("text-sm font-semibold text-slate-500", step.current && "text-sky-700")}>{step.label}</p>
            <p className="text-xs text-slate-500">{step.timestamp ?? "Pending"}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
