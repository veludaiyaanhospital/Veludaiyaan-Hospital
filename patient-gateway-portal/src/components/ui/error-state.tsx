import { AlertTriangle } from "lucide-react";

import { cn } from "@/lib/utils";

export function ErrorState({
  title,
  description,
  className,
}: {
  title: string;
  description: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border border-rose-200 bg-rose-50 p-6", className)}>
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 text-rose-600" />
        <div>
          <h3 className="text-sm font-semibold text-rose-800">{title}</h3>
          <p className="mt-1 text-sm text-rose-700">{description}</p>
        </div>
      </div>
    </div>
  );
}