import "dotenv/config";

function required(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

export const config = {
  port: Number(process.env.PORT ?? 8080),
  nodeEnv: process.env.NODE_ENV ?? "development",
  corsOrigins: (process.env.CORS_ORIGIN ?? "http://localhost:3000")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean),
  sessionSecret: required("SESSION_SECRET"),
  sessionCookieDomain: process.env.SESSION_COOKIE_DOMAIN,
  sessionCookieName: process.env.SESSION_COOKIE_NAME ?? "vh_patient_session",
  hmsBaseUrl: required("HMS_BASE_URL").replace(/\/+$/, ""),
  hmsApiKey: process.env.HMS_API_KEY,
  hmsApiKeyHeader: process.env.HMS_API_KEY_HEADER ?? "x-api-key",
  hmsTimeoutMs: Number(process.env.HMS_TIMEOUT_MS ?? 10000),
  authRateLimitWindowMs: Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS ?? 15 * 60 * 1000),
  otpRequestRateLimitMax: Number(process.env.OTP_REQUEST_RATE_LIMIT_MAX ?? 5),
  otpVerifyRateLimitMax: Number(process.env.OTP_VERIFY_RATE_LIMIT_MAX ?? 10),
  refreshRateLimitMax: Number(process.env.REFRESH_RATE_LIMIT_MAX ?? 20),
};

export function isProduction() {
  return config.nodeEnv === "production";
}
