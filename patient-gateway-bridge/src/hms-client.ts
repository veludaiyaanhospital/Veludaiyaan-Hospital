import { config } from "./config.js";
import type { GatewaySession } from "./session.js";

interface HmsErrorPayload {
  message?: string;
}

async function parseJson(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return null;
  }

  return response.json();
}

export async function hmsRequest<T>(
  path: string,
  options?: {
    method?: string;
    body?: unknown;
    session?: GatewaySession;
  },
) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.hmsTimeoutMs);

  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (config.hmsApiKey) {
      headers[config.hmsApiKeyHeader] = config.hmsApiKey;
    }

    if (options?.session?.accessToken) {
      headers.Authorization = `Bearer ${options.session.accessToken}`;
    }

    const response = await fetch(`${config.hmsBaseUrl}${path}`, {
      method: options?.method ?? "GET",
      headers,
      body: options?.body === undefined ? undefined : JSON.stringify(options.body),
      signal: controller.signal,
    });

    const payload = (await parseJson(response)) as T | HmsErrorPayload | null;

    if (!response.ok) {
      const message =
        payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string"
          ? payload.message
          : "HMS request failed.";
      throw new Error(message);
    }

    return payload as T;
  } finally {
    clearTimeout(timer);
  }
}
