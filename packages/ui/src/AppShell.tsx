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
  children: ReactNode;
}

/**
 * Shared page chrome (Navbar + Sidebar + main) rendered by every zone.
 * Presentational only — no framework router import, so it stays in @lms/ui.
 */
export function AppShell({ activeHref, actions, can = () => true, children }: AppShellProps) {
  const links = navLinks.filter((l) => can(l.permission));
  const items = sidebarItems.filter((i) => can(i.permission));
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar brand="LMS" links={links} actions={actions} />
      <div className="flex flex-1">
        <Sidebar items={items} activeHref={activeHref} />
        <main className="flex-1 p-8">{children}</main>
      </div>
    </div>
  );
}
