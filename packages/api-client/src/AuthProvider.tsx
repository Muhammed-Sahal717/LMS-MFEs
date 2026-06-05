"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { authApi } from "./auth";
import { getRefreshToken, isAuthenticated } from "./tokens";
import type { MeOut } from "./types";

interface AuthContextValue {
  user: MeOut | null;
  loading: boolean;
  permissions: string[];
  /** Licensed module codes (if backend provides them on /auth/me). */
  modules: string[];
  /** True if no permission is required, or the user holds it. */
  can: (permission?: string) => boolean;
  reload: () => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/**
 * Bootstraps the session from /auth/me and exposes permissions for UI gating.
 * Wrap every zone's tree in this. The server stays the source of truth — gating
 * here only show/hide/disables; a real 403 is still handled by the API client.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<MeOut | null>(null);
  const [loading, setLoading] = useState(true);

  const reload = useCallback(async () => {
    if (!isAuthenticated()) {
      setUser(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      setUser(await authApi.me());
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout(getRefreshToken() ?? undefined);
    setUser(null);
    if (typeof window !== "undefined") window.location.href = "/auth/login";
  }, []);

  useEffect(() => {
    reload();
  }, [reload]);

  // Refresh failed somewhere → drop the session and route to login.
  useEffect(() => {
    function onUnauth() {
      setUser(null);
      if (typeof window !== "undefined" && !window.location.pathname.startsWith("/auth")) {
        window.location.href = "/auth/login";
      }
    }
    window.addEventListener("lms:unauthenticated", onUnauth);
    return () => window.removeEventListener("lms:unauthenticated", onUnauth);
  }, []);

  const permissions = user?.permissions ?? [];
  const modules = user?.modules ?? [];
  const can = useCallback(
    (permission?: string) => !permission || permissions.includes(permission),
    [permissions],
  );

  return (
    <AuthContext.Provider value={{ user, loading, permissions, modules, can, reload, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
