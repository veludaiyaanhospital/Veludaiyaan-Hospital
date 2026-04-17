import crypto from "node:crypto";

import { config, isProduction } from "./config.js";

export interface GatewaySession {
  accessToken: string;
  refreshToken: string;
  patientId: string;
  expiresAt: string;
  refreshExpiresAt: string;
  role: string;
}

function deriveKey(secret: string) {
  return crypto.createHash("sha256").update(secret).digest();
}

const key = deriveKey(config.sessionSecret);

export function sealSession(session: GatewaySession) {
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const plaintext = Buffer.from(JSON.stringify(session), "utf8");
  const encrypted = Buffer.concat([cipher.update(plaintext), cipher.final()]);
  const tag = cipher.getAuthTag();

  return Buffer.concat([iv, tag, encrypted]).toString("base64url");
}

export function unsealSession(value: string): GatewaySession | null {
  try {
    const raw = Buffer.from(value, "base64url");
    const iv = raw.subarray(0, 12);
    const tag = raw.subarray(12, 28);
    const encrypted = raw.subarray(28);
    const decipher = crypto.createDecipheriv("aes-256-gcm", key, iv);
    decipher.setAuthTag(tag);
    const decrypted = Buffer.concat([decipher.update(encrypted), decipher.final()]);
    return JSON.parse(decrypted.toString("utf8")) as GatewaySession;
  } catch {
    return null;
  }
}

export function buildSessionCookie(refreshExpiresAt: string) {
  return {
    httpOnly: true,
    secure: isProduction(),
    sameSite: "lax" as const,
    domain: config.sessionCookieDomain,
    path: "/",
    expires: new Date(refreshExpiresAt),
  };
}
