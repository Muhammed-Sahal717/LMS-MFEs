export * from "./types";

// Core client
export { api } from "./client";
export { ApiError, type ApiErrorBody } from "./errors";
export { API_BASE, getTenantId, setTenantId, hasUrlTenant } from "./config";
export {
  getAccessToken,
  getRefreshToken,
  setTokens,
  clearTokens,
  isAuthenticated,
} from "./tokens";

// Auth + session
export { authApi } from "./auth";
export { AuthProvider, useAuth } from "./AuthProvider";

// Domain APIs (legacy zones — migrate to real endpoints per zone)
export { catalogApi } from "./catalog";
export { learningApi } from "./learning";
export { assignmentsApi } from "./assignments";
export { dashboardApi } from "./dashboard";
export { adminApi } from "./admin";
