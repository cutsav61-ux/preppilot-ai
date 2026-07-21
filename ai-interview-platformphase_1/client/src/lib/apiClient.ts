import { API_BASE_URL } from "@/lib/constants";
import { useAuthStore } from "@/store/authStore";
import type { User } from "@/types/user";

export interface ApiEnvelope<T> {
  success: boolean;
  data?: T;
  message?: string;
  error?: { code: string; details?: unknown };
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

interface RequestOptions extends Omit<RequestInit, "body"> {
  body?: unknown;
  accessToken?: string;
  /** Internal: set on the retried request after a refresh, to prevent infinite loops. */
  _isRetry?: boolean;
}

async function rawRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { body, accessToken, headers, _isRetry, ...rest } = options;
  void _isRetry;

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...rest,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const envelope = (await response.json().catch(() => null)) as ApiEnvelope<T> | null;

  if (!response.ok || !envelope?.success) {
    throw new ApiError(
      envelope?.message ?? "Something went wrong. Please try again.",
      response.status,
      envelope?.error?.code,
    );
  }

  return envelope.data as T;
}

// Dedupes concurrent refresh attempts so 5 parallel 401s only trigger 1 refresh call.
let refreshPromise: Promise<{ user: User; accessToken: string }> | null = null;

function refreshSession() {
  if (!refreshPromise) {
    refreshPromise = rawRequest<{ user: User; accessToken: string }>("/auth/refresh", {
      method: "POST",
    }).finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

/**
 * Authenticated request wrapper: attaches the current access token from
 * authStore, and — on a 401 that isn't from /auth/* itself — silently
 * refreshes the session once and retries the original request.
 */
async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const accessToken = useAuthStore.getState().accessToken ?? undefined;

  try {
    return await rawRequest<T>(path, { ...options, accessToken });
  } catch (error) {
    const isAuthEndpoint = path.startsWith("/auth/");
    const isUnauthorized = error instanceof ApiError && error.status === 401;

    if (isUnauthorized && !isAuthEndpoint && !options._isRetry) {
      try {
        const { user, accessToken: newAccessToken } = await refreshSession();
        useAuthStore.getState().setSession(user, newAccessToken);
        return await rawRequest<T>(path, {
          ...options,
          accessToken: newAccessToken,
          _isRetry: true,
        });
      } catch {
        useAuthStore.getState().clearSession();
        throw error;
      }
    }

    throw error;
  }
}

export const apiClient = {
  get: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "GET" }),
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "POST", body }),
  put: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PUT", body }),
  patch: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "PATCH", body }),
  delete: <T>(path: string, options?: RequestOptions) =>
    request<T>(path, { ...options, method: "DELETE" }),
};

/** Unauthenticated calls (signup/login/forgot-password/etc.) skip the token dance entirely. */
export const publicApiClient = {
  post: <T>(path: string, body?: unknown, options?: RequestOptions) =>
    rawRequest<T>(path, { ...options, method: "POST", body }),
};
