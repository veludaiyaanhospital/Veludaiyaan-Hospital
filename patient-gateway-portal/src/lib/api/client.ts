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
  // SECURITY NOTE: Remote API access should be routed via secure API gateway
  // with zero-trust controls (or VPN-backed network boundaries) before production rollout.
  apiBaseUrl: process.env.NEXT_PUBLIC_PATIENT_GATEWAY_API_BASE_URL ?? "https://api.example-hms.local",
};
