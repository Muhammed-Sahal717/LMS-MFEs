"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAuth } from "@lms/api-client";
import { Loader } from "@lms/ui";

export function AdminGuard({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const pathname = usePathname();

  useEffect(() => {
    if (!loading) {
      if (!user) {
        window.location.href = "/auth/login";
        return;
      }

      // Check if user has an admin or instructor role
      const roles = user.roles.map(r => r.code);
      const isSuper = roles.includes("super_admin");
      const isAdmin = roles.includes("admin") || roles.includes("tenant_admin");
      const isInstructor = roles.includes("instructor");
      
      let hasAccess = false;
      const subpath = pathname.replace(/^\/admin/, "") || "/";
      
      if (subpath === "/tenants") hasAccess = isSuper;
      else if (subpath === "/reports") hasAccess = isSuper || isAdmin || isInstructor;
      else if (subpath === "/users") hasAccess = isSuper || isAdmin || isInstructor; // Instructors can invite students
      else hasAccess = isSuper || isAdmin || isInstructor; // Default overview/courses

      if (!hasAccess) {
        window.location.href = "/dashboard";
      }
    }
  }, [user, loading, pathname]);

  if (loading || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[hsl(var(--background))]">
        <Loader size="lg" label="Verifying access..." />
      </div>
    );
  }

  const roles = user.roles.map(r => r.code);
  const isSuper = roles.includes("super_admin");
  const isAdmin = roles.includes("admin") || roles.includes("tenant_admin");
  const isInstructor = roles.includes("instructor");
  
  let hasAccess = false;
  const subpath = pathname.replace(/^\/admin/, "") || "/";
  if (subpath === "/tenants") hasAccess = isSuper;
  else if (subpath === "/reports") hasAccess = isSuper || isAdmin || isInstructor;
  else if (subpath === "/users") hasAccess = isSuper || isAdmin || isInstructor;
  else hasAccess = isSuper || isAdmin || isInstructor;

  if (!hasAccess) {
    return null; // Will redirect via useEffect
  }

  return <>{children}</>;
}
