import { api } from "./client";
import { clearTokens, setTokens } from "./tokens";
import type { MeOut, RegisterPayload, TokenResponse, UserOut } from "./types";

/**
 * Auth endpoints (/api/v1/auth — core module, no license needed).
 * Pre-auth calls pass `auth: false` (no bearer, no refresh retry).
 */
export const authApi = {
  /** Logs in and stores the rotating token pair. */
  login: async (email: string, password: string): Promise<TokenResponse> => {
    const tokens = await api.post<TokenResponse>(
      "/auth/login",
      { email, password },
      { auth: false },
    );
    setTokens(tokens);
    return tokens;
  },

  /** Self-service register → Student role. Returns the user (no tokens). */
  register: (payload: RegisterPayload): Promise<UserOut> =>
    api.post<UserOut>("/auth/register", payload, { auth: false }),

  forgotPassword: (email: string): Promise<{ message: string }> =>
    api.post<{ message: string }>("/auth/forgot-password", { email }, { auth: false }),

  resetPassword: (token: string, new_password: string): Promise<{ message: string }> =>
    api.post<{ message: string }>(
      "/auth/reset-password",
      { token, new_password },
      { auth: false },
    ),

  /** Current user + roles + resolved permissions. Build UI gating off this. */
  me: (): Promise<MeOut> => api.get<MeOut>("/auth/me"),

  /** Revokes the session server-side, then clears local tokens. */
  logout: async (refresh_token?: string): Promise<void> => {
    try {
      await api.post("/auth/logout", { refresh_token });
    } catch {
      // best-effort; clear locally regardless
    }
    clearTokens();
  },
};
