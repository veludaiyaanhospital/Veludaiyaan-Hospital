"use client";

import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { authService } from "@/lib/api";
import { DEFAULT_PROTECTED_ROUTE } from "@/lib/auth/paths";
import type { OtpRequestPayload, OtpVerifyPayload } from "@/lib/types";
import { useAuthStore } from "@/store/auth-store";

export function useAuthSession() {
  const session = useAuthStore((state) => state.session);
  const isHydrated = useAuthStore((state) => state.isHydrated);
  return { session, isHydrated };
}

export function useOtpAuth() {
  const router = useRouter();
  const setSession = useAuthStore((state) => state.setSession);
  const setOtpState = useAuthStore((state) => state.setOtpState);
  const clearSession = useAuthStore((state) => state.clearSession);
  const session = useAuthStore((state) => state.session);

  const requestOtpMutation = useMutation({
    mutationFn: (payload: OtpRequestPayload) => authService.requestOtp(payload),
    onSuccess: (data, variables) => {
      setOtpState({
        requestId: data.requestId,
        mobile: variables.mobile,
        requestedAt: new Date().toISOString(),
      });
      toast.success(`OTP sent to ${data.maskedMobile}. Use 123456 for demo login.`);
    },
    onError: (error: Error) => {
      toast.error(error.message || "Unable to send OTP now.");
    },
  });

  const verifyOtpMutation = useMutation({
    mutationFn: (payload: OtpVerifyPayload) => authService.verifyOtp(payload),
    onSuccess: (nextSession) => {
      setSession(nextSession);
      toast.success("Login successful");
      router.replace(DEFAULT_PROTECTED_ROUTE);
    },
    onError: (error: Error) => {
      toast.error(error.message || "OTP verification failed");
    },
  });

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      clearSession();
      router.replace("/patient/login");
      toast.success("Logged out");
    },
    onError: () => {
      clearSession();
      router.replace("/patient/login");
    },
  });

  const refreshMutation = useMutation({
    mutationFn: () => {
      if (!session) {
        throw new Error("No session available");
      }
      return authService.refreshSession(session.refreshToken);
    },
    onSuccess: (nextSession) => {
      setSession(nextSession);
    },
    onError: () => {
      clearSession();
      router.replace("/patient/login");
    },
  });

  return {
    requestOtpMutation,
    verifyOtpMutation,
    logoutMutation,
    refreshMutation,
  };
}
