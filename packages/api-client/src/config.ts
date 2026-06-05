/** Backend connection config. Override per environment via NEXT_PUBLIC_* envs. */
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export const DEFAULT_TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID ?? "full-lms";

export function getTenantId(): string {
  if (typeof window !== "undefined") {
    return localStorage.getItem("tenant_id") ?? DEFAULT_TENANT_ID;
  }
  return DEFAULT_TENANT_ID;
}

export function setTenantId(tenantId: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("tenant_id", tenantId);
  }
}

