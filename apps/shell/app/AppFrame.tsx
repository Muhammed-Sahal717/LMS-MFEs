"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AppShell, Button, Avatar, ThemeToggle, Separator } from "@lms/ui";
import { useAuth } from "@lms/api-client";

/** Shared chrome fed with this app's path + the user's permissions/session. */
export function AppFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, can, logout, loading } = useAuth();

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
      <Button size="sm" variant="outline" onClick={logout}>
        Sign out
      </Button>
    </div>
  ) : (
    <div className="flex items-center gap-2">
      <ThemeToggle />
      <a href="/auth/login">
        <Button size="sm">Sign in</Button>
      </a>
    </div>
  );

  // Landing page — no sidebar
  if (pathname === "/") {
    return (
      <div className="flex min-h-screen flex-col bg-[hsl(var(--background))]">
        <header className="sticky top-0 z-40 h-14 w-full border-b border-[hsl(var(--border))] bg-[hsl(var(--background)/0.8)] backdrop-blur-md supports-[backdrop-filter]:bg-[hsl(var(--background)/0.6)]">
          <div className="flex h-full items-center justify-between px-6">
            <a href="/" className="flex items-center gap-2 font-bold text-[hsl(var(--foreground))]">
              <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[hsl(var(--primary))] text-xs font-black text-[hsl(var(--primary-foreground))]">
                L
              </span>
              LMS
            </a>
            {actions}
          </div>
        </header>
        {children}
      </div>
    );
  }

  return (
    <AppShell activeHref={pathname} can={can} actions={actions} userRoles={user?.roles?.map(r => r.code) || []}>
      {children}
    </AppShell>
  );
}
