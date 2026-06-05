/** Backend connection config. Override per environment via NEXT_PUBLIC_* envs. */
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

/**
 * Tenant slug sent as X-Tenant-ID on pre-auth calls. Post-auth the backend
 * reads the tenant from the JWT (the JWT always wins), so this only matters for
 * login/register/refresh/forgot/reset.
 */
export const TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID ?? "full-lms";
