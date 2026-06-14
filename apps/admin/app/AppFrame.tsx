"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AppShell, Button, Avatar, ThemeToggle, Separator } from "@lms/ui";
import { useAuth } from "@lms/api-client";

/** Shared chrome fed with this app's path + the user's permissions/session. */
export function AppFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, can, hasModule, logout, loading } = useAuth();
  
  // Next.js usePathname strips the basePath. We must prepend it so the global Sidebar matches correctly.
  const fullPath = "/admin" + (pathname === "/" ? "" : pathname);

  const actions = loading ? (
    <div className="h-8 w-24 animate-pulse rounded-lg bg-[hsl(var(--muted))]" />
  ) : user ? (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      <Separator orientation="vertical" className="h-5" />
      <div className="flex items-center gap-2.5">
        <Avatar name={user.full_name ?? user.email} size="sm" />
        <span className="hidden text-sm font-medium text-[hsl(var(--foreground))] sm:block">
          {user.full_name ?? user.email}
        </span>
      </div>
      <Button size="sm" variant="outline" onClick={logout}>Sign out</Button>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      <a href="/auth/login"><Button size="sm">Login</Button></a>
    </div>
  );

  return (
    <AppShell
      activeHref={fullPath}
      can={can}
      hasModule={hasModule}
      userRoles={user?.roles?.map(r => r.code) || []}
      actions={actions}
    >
      {children}
    </AppShell>
  );
}
