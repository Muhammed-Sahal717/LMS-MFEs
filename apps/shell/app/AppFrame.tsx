"use client";

import type { ReactNode } from "react";
import { usePathname } from "next/navigation";
import { AppShell, Button } from "@lms/ui";
import { useAuth } from "@lms/api-client";

/** Shared chrome fed with this app's path + the user's permissions/session. */
export function AppFrame({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { user, can, logout, loading } = useAuth();
  const actions = loading ? null : user ? (
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
  );

  // For the marketing landing page, we don't want the Sidebar or the constrained padding.
  // We still want the Navbar for the login button.
  if (pathname === "/") {
    return (
      <div className="flex min-h-screen flex-col">
        <div className="border-b border-border bg-surface px-4 py-3 flex items-center justify-between shadow-sm sticky top-0 z-50">
          <div className="font-bold text-brand-600 text-xl tracking-tight">LMS</div>
          {actions}
        </div>
        {children}
      </div>
    );
  }

  return (
    <AppShell activeHref={pathname} can={can} actions={actions}>
      {children}
    </AppShell>
  );
}
