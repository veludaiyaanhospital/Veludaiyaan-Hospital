export interface ApiError {
  code: string;
  message: string;
}

export interface ApiResponse<T> {
  data: T;
  timestamp: string;
}

const DEFAULT_DELAY_MS = 650;

export async function withMockLatency<T>(
  resolver: () => T,
  options?: { delayMs?: number; shouldFail?: boolean; error?: ApiError },
): Promise<ApiResponse<T>> {
  const delayMs = options?.delayMs ?? DEFAULT_DELAY_MS;

  await new Promise((resolve) => setTimeout(resolve, delayMs));

  if (options?.shouldFail) {
    throw options.error ?? { code: "MOCK_API_ERROR", message: "Unable to process request right now." };
  }

  return {
    data: resolver(),
    timestamp: new Date().toISOString(),
  };
}

export const integrationConfig = {
  // SECURITY NOTE: Remote API access should be routed via a secure gateway service.
  apiBaseUrl: (process.env.NEXT_PUBLIC_PATIENT_GATEWAY_API_BASE_URL ?? "").replace(/\/+$/, ""),
};

export function hasRemoteGateway() {
  return integrationConfig.apiBaseUrl.length > 0;
}

export async function fetchGateway<T>(path: string, init?: RequestInit): Promise<T> {
  if (!hasRemoteGateway()) {
    throw new Error("Secure patient gateway is not configured.");
  }

  const response = await fetch(`${integrationConfig.apiBaseUrl}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });

  const contentType = response.headers.get("content-type") ?? "";
  const payload = contentType.includes("application/json") ? await response.json() : null;

  if (!response.ok) {
    const message =
      (payload && typeof payload === "object" && "message" in payload && typeof payload.message === "string"
        ? payload.message
        : null) ?? "Unable to complete request right now.";
    throw new Error(message);
  }

  return payload as T;
}
