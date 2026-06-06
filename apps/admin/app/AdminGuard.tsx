"use client";

import { useEffect } from "react";
import { useAuth } from "@lms/api-client";
import { Loader } from "@lms/ui";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        window.location.href = "/auth/login";
        return;
      }

      // Check if user has an admin or instructor role
      const hasAccess = user.roles.some((r) => ["admin", "tenant_admin", "super_admin", "instructor"].includes(r.code));
      if (!hasAccess) {
        window.location.href = "/dashboard";
      }
    }
  }, [user, loading]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50">
        <Loader size="lg" label="Verifying access..." />
      </div>
    );
  }

  const hasAccess = user.roles.some((r) => ["admin", "tenant_admin", "super_admin", "instructor"].includes(r.code));
  if (!hasAccess) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
}
