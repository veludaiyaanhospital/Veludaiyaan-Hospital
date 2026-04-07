"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import type { AuthSession } from "@/lib/types";

interface OtpState {
  requestId: string;
  mobile: string;
  requestedAt: string;
}

interface AuthStoreState {
  session: AuthSession | null;
  otpState: OtpState | null;
  isHydrated: boolean;
  setSession: (session: AuthSession | null) => void;
  setOtpState: (otpState: OtpState | null) => void;
  clearSession: () => void;
  setHydrated: (value: boolean) => void;
}

export const useAuthStore = create<AuthStoreState>()(
  persist(
    (set) => ({
      session: null,
      otpState: null,
      isHydrated: false,
      setSession: (session) => set({ session }),
      setOtpState: (otpState) => set({ otpState }),
      clearSession: () => set({ session: null, otpState: null }),
      setHydrated: (value) => set({ isHydrated: value }),
    }),
    {
      name: "patient-gateway-auth",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({ session: state.session, otpState: state.otpState }),
      onRehydrateStorage: () => (state) => {
        state?.setHydrated(true);
      },
    },
  ),
);
