import { config } from "./config.js";
import type { GatewaySession } from "./session.js";

interface HmsErrorPayload {
  detail?: string;
  message?: string;
}

export class HmsHttpError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "HmsHttpError";
    this.status = status;
  }
}

interface HmsRequestOptions {
  method?: string;
  body?: unknown;
  headers?: Record<string, string>;
  session?: GatewaySession;
}

async function parseJson(response: Response) {
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return null;
  }

  return response.json();
}

function buildTargetUrl(path: string) {
  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  return `${config.hmsBaseUrl}${path}`;
}

export async function hmsFetch(path: string, options?: HmsRequestOptions) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), config.hmsTimeoutMs);

  try {
    const headers: Record<string, string> = { ...(options?.headers ?? {}) };

    if (config.hmsApiKey) {
      headers[config.hmsApiKeyHeader] = config.hmsApiKey;
    }

    if (options?.session?.accessToken) {
      headers.Authorization = `Bearer ${options.session.accessToken}`;
    }

    if (options?.body !== undefined && !headers["Content-Type"]) {
      headers["Content-Type"] = "application/json";
    }

    return await fetch(buildTargetUrl(path), {
      method: options?.method ?? "GET",
      headers,
      body: options?.body === undefined ? undefined : JSON.stringify(options.body),
      signal: controller.signal,
    });
  } finally {
    clearTimeout(timer);
  }
}

export async function hmsRequest<T>(path: string, options?: HmsRequestOptions) {
  const response = await hmsFetch(path, options);
  const payload = (await parseJson(response)) as T | HmsErrorPayload | null;

  if (!response.ok) {
    const errorPayload = payload as HmsErrorPayload | null;
    const message =
      errorPayload && typeof errorPayload === "object"
        ? (typeof errorPayload.message === "string" && errorPayload.message) ||
          (typeof errorPayload.detail === "string" && errorPayload.detail) ||
          "HMS request failed."
        : "HMS request failed.";
    throw new HmsHttpError(response.status, message);
  }

  return payload as T;
}
