"use client";

/**
 * Token storage. All MFE zones are served under the shell's single origin
 * (via Multi-Zones rewrites), so localStorage here is shared across zones —
 * that is how the session crosses MFEs. A mirror cookie is set for future
 * SSR/middleware route-guards.
 */

const ACCESS = "lms_access";
const REFRESH = "lms_refresh";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS);
}

export function getRefreshToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH);
}

export function setTokens(t: { access_token: string; refresh_token: string }): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(ACCESS, t.access_token);
  localStorage.setItem(REFRESH, t.refresh_token);
  document.cookie = `${ACCESS}=${t.access_token}; path=/; max-age=900; samesite=lax`;
}

export function clearTokens(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(ACCESS);
  localStorage.removeItem(REFRESH);
  document.cookie = `${ACCESS}=; path=/; max-age=0`;
}

export function isAuthenticated(): boolean {
  return getAccessToken() !== null;
}
