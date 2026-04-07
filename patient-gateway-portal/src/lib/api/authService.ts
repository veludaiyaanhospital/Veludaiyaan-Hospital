import type { AuthSession, OtpRequestPayload, OtpVerifyPayload } from "@/lib/types";

import { withMockLatency } from "./client";

interface OtpRequestResult {
  requestId: string;
  maskedMobile: string;
  expiresInSeconds: number;
}

const OTP_EXPIRY_SECONDS = 120;
const SESSION_EXPIRY_MINUTES = 30;
const DEMO_OTP = "123456";

let activeSession: AuthSession | null = null;

export const authService = {
  async requestOtp(payload: OtpRequestPayload): Promise<OtpRequestResult> {
    return (
      await withMockLatency(() => {
        if (!/^\d{10}$/.test(payload.mobile)) {
          throw new Error("Enter a valid 10-digit mobile number.");
        }

        const maskedMobile = `${payload.mobile.slice(0, 2)}******${payload.mobile.slice(-2)}`;

        return {
          requestId: `otp-${Date.now()}`,
          maskedMobile,
          expiresInSeconds: OTP_EXPIRY_SECONDS,
        };
      }, { delayMs: 800 })
    ).data;
  },

  async verifyOtp(payload: OtpVerifyPayload): Promise<AuthSession> {
    return (
      await withMockLatency(() => {
        const validMobile = /^\d{10}$/.test(payload.mobile);
        const validOtp = payload.otp === DEMO_OTP;
        const validUhid = !payload.uhid || payload.uhid.trim().length >= 4;

        if (!validMobile || !validOtp || !validUhid) {
          throw new Error("Invalid OTP or patient details.");
        }

        const expiresAt = new Date(Date.now() + SESSION_EXPIRY_MINUTES * 60 * 1000).toISOString();

        activeSession = {
          token: `mock-access-${Date.now()}`,
          refreshToken: `mock-refresh-${Date.now()}`,
          expiresAt,
          patientId: "PAT-000981",
          role: "patient",
        };

        return activeSession;
      }, { delayMs: 900 })
    ).data;
  },

  async refreshSession(refreshToken: string): Promise<AuthSession> {
    return (
      await withMockLatency(() => {
        if (!activeSession || activeSession.refreshToken !== refreshToken) {
          throw new Error("Session refresh failed. Please login again.");
        }

        activeSession = {
          ...activeSession,
          token: `mock-access-${Date.now()}`,
          expiresAt: new Date(Date.now() + SESSION_EXPIRY_MINUTES * 60 * 1000).toISOString(),
        };

        return activeSession;
      }, { delayMs: 550 })
    ).data;
  },

  async logout(): Promise<void> {
    await withMockLatency(
      () => {
        activeSession = null;
      },
      { delayMs: 300 },
    );
  },
};
