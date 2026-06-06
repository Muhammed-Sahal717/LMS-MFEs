/** Backend connection config. Override per environment via NEXT_PUBLIC_* envs. */
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";

export const DEFAULT_TENANT_ID = process.env.NEXT_PUBLIC_TENANT_ID ?? "full-lms";

export function getTenantId(): string {
  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;

    // 1. Detect subdomain from standard domains (abc.domain.com or abc.localhost)
    const parts = hostname.split(".");
    if (parts.length > 2 || (parts.length === 2 && parts[1] === "localhost")) {
      const slug = parts[0] ?? "";
      if (slug !== "www" && slug !== "lms-mf-es-shell") {
        return slug;
      }
    }

    // 2. Detect from custom Vercel sub-deployments (e.g. abc-academy-lms.vercel.app)
    if (hostname.endsWith("-lms.vercel.app")) {
      return hostname.replace("-lms.vercel.app", "");
    }

    // 3. Fallback to manually selected dropdown value
    const stored = localStorage.getItem("tenant_id");
    if (stored) return stored;
  }

  // 4. Default hardcoded fallback
  return process.env.NEXT_PUBLIC_TENANT_ID ?? "full-lms";
}

export function setTenantId(tenantId: string) {
  if (typeof window !== "undefined") {
    localStorage.setItem("tenant_id", tenantId);
  }
}
