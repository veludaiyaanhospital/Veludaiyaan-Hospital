"use client";

import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

import { canAccessPatientRoute } from "@/lib/auth/session";
import { useAuthStore } from "@/store/auth-store";

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  const session = useAuthStore((state) => state.session);
  const isHydrated = useAuthStore((state) => state.isHydrated);

  useEffect(() => {
    if (!isHydrated) {
      return;
    }

    if (!canAccessPatientRoute(session)) {
      const redirectUrl = `/patient/login?next=${encodeURIComponent(pathname || "/patient/dashboard")}`;
      router.replace(redirectUrl);
    }
  }, [isHydrated, pathname, router, session]);

  if (!isHydrated || !canAccessPatientRoute(session)) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center">
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-5 text-sm text-slate-600 shadow-sm">
          Checking secure session...
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
