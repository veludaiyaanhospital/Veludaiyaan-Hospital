export type Role = "patient";

export interface AuthSession {
  token: string;
  refreshToken: string;
  expiresAt: string;
  patientId: string;
  role: Role;
}

export interface OtpRequestPayload {
  mobile: string;
  uhid?: string;
}

export interface OtpVerifyPayload {
  mobile: string;
  otp: string;
  uhid?: string;
}