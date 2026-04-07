import { Skeleton } from "@/components/ui/skeleton";

export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-48" />
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
        <Skeleton className="h-28 w-full" />
      </div>
      <Skeleton className="h-56 w-full" />
    </div>
  );
}