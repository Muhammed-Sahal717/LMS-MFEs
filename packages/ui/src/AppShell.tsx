import type { ReactNode } from "react";
import { Navbar } from "./Navbar";
import { Sidebar } from "./Sidebar";
import { navLinks, sidebarItems } from "./navConfig";

export interface AppShellProps {
  /** Current pathname for sidebar highlight (pass from host's usePathname). */
  activeHref?: string;
  /** Right side of navbar: login button or user menu. */
  actions?: ReactNode;
  /**
   * Permission check from useAuth. Items with a `permission` are hidden unless
   * this returns true. Defaults to showing everything (no gating).
   */
  can?: (permission?: string) => boolean;
  /**
   * Module check from useAuth. Items with a `module` are hidden unless
   * this returns true. Defaults to showing everything (no gating).
   */
  hasModule?: (moduleCode?: string) => boolean;
  /** Current user's role codes. */
  userRoles?: string[];
  children: ReactNode;
}

/**
 * Shared page chrome (Navbar + Sidebar + main) rendered by every zone.
 * Presentational only — no framework router import, so it stays in @lms/ui.
 */
export function AppShell({
  activeHref,
  actions,
  can = () => true,
  hasModule = () => true,
  userRoles = [],
  children,
}: AppShellProps) {
  const checkRole = (roles?: string[]) => !roles || roles.some((r) => userRoles.includes(r));

  const links = navLinks.filter((l) => can(l.permission) && hasModule(l.module) && checkRole(l.roles));
  const items = sidebarItems.filter((i) => can(i.permission) && hasModule(i.module) && checkRole(i.roles));

  return (
    <div className="flex min-h-screen flex-col bg-[hsl(var(--background))]">
      <Navbar brand="LMS" links={links} actions={actions} />
      <div className="flex flex-1">
        <Sidebar items={items} activeHref={activeHref} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-screen-2xl p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
