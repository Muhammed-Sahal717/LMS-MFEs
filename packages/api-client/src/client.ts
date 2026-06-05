import { API_BASE, getTenantId } from "./config";
import { ApiError, type ApiErrorBody } from "./errors";
import {
  clearTokens,
  getAccessToken,
  getRefreshToken,
  setTokens,
} from "./tokens";

interface RequestOptions extends RequestInit {
  /** Attach bearer token + enable auto-refresh on 401. Default true. */
  auth?: boolean;
  /** Internal: set after a refresh retry so we never loop. */
  _retried?: boolean;
}

// ---- Single-flight refresh -------------------------------------------------
// Concurrent 401s must not each spend the (rotating) refresh token. They share
// one in-flight refresh promise.
let refreshing: Promise<boolean> | null = null;

async function doRefresh(): Promise<boolean> {
  const refresh_token = getRefreshToken();
  if (!refresh_token) return false;
  try {
    const res = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Tenant-ID": getTenantId() },
      body: JSON.stringify({ refresh_token }),
    });
    if (!res.ok) {
      clearTokens();
      return false;
    }
    setTokens(await res.json());
    return true;
  } catch {
    clearTokens();
    return false;
  }
}

function refreshOnce(): Promise<boolean> {
  if (!refreshing) refreshing = doRefresh().finally(() => (refreshing = null));
  return refreshing;
}

function onUnauthenticated(): void {
  clearTokens();
  if (typeof window !== "undefined") {
    window.dispatchEvent(new CustomEvent("lms:unauthenticated"));
  }
}

// ---- Core request ----------------------------------------------------------
async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = true, _retried, headers, ...init } = options;

  const finalHeaders: Record<string, string> = {
    "Content-Type": "application/json",
    "X-Tenant-ID": getTenantId(),
    ...(headers as Record<string, string>),
  };
  if (auth) {
    const token = getAccessToken();
    if (token) finalHeaders.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...init, headers: finalHeaders });

  if (res.status === 204) return undefined as T;

  if (res.ok) return (await res.json()) as T;

  // Parse the error envelope.
  let body: Partial<ApiErrorBody> = {};
  try {
    body = (await res.json()) as Partial<ApiErrorBody>;
  } catch {
    body = { error: res.statusText };
  }

  // Expired access token → try one refresh, then replay the request once.
  if (res.status === 401 && body.code === "unauthenticated" && auth && !_retried) {
    const ok = await refreshOnce();
    if (ok) return request<T>(path, { ...options, _retried: true });
    onUnauthenticated();
  }

  throw new ApiError(res.status, body);
}

/** Verb helpers. `auth: false` for pre-auth calls (login/register/refresh/forgot/reset). */
export const api = {
  request,
  get: <T>(path: string, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: "GET" }),
  post: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: "POST", body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  del: <T>(path: string, opts?: RequestOptions) =>
    request<T>(path, { ...opts, method: "DELETE" }),
};
