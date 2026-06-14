"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AppShell, Button } from "@lms/ui";
import { useAuth } from "@lms/api-client";

/** Shared chrome fed with this app's path + the user's permissions/session. */
export function AppFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, can, hasModule, logout, loading } = useAuth();
  
  // Next.js usePathname strips the basePath. We must prepend it so the global Sidebar matches correctly.
  const fullPath = "/admin" + (pathname === "/" ? "" : pathname);

  return (
    <AppShell
      activeHref={fullPath}
      can={can}
      hasModule={hasModule}
      actions={
        loading ? null : user ? (
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-600">{user.full_name ?? user.email}</span>
            <Button size="sm" variant="secondary" onClick={logout}>
              Logout
            </Button>
          </div>
        ) : (
          <a href="/auth/login">
            <Button size="sm">Login</Button>
          </a>
        )
      }
    >
      {children}
    </AppShell>
  );
}
