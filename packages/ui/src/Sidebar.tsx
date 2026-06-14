import type { ReactNode } from "react";
import { cn } from "./cn";

export interface SidebarItem {
  label: string;
  href: string;
  icon?: ReactNode;
  /** Required permission to show this item (omitted = always shown). */
  permission?: string;
  /** Required module code to show this item (omitted = always shown). */
  module?: string;
}

export interface SidebarProps {
  items: SidebarItem[];
  /** Current path; item whose href prefixes it is highlighted. */
  activeHref?: string;
  className?: string;
}

/**
 * Left navigation rail shared across MFE zones.
 * Presentational only — pass activeHref from the host (e.g. usePathname)
 * so this package stays framework-agnostic.
 */
export function Sidebar({ items, activeHref, className }: SidebarProps) {
  return (
    <aside className={cn("w-60 shrink-0 border-r border-border bg-surface p-4", className)}>
      <nav className="flex flex-col gap-1">
        {items.map((item) => {
          const active =
            activeHref === item.href ||
            (item.href !== "/" && activeHref?.startsWith(item.href));
          return (
            <a
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                active
                  ? "bg-brand-50 text-brand-700"
                  : "text-gray-600 hover:bg-surface-muted hover:text-gray-900",
              )}
            >
              {item.icon ? <span className="text-base">{item.icon}</span> : null}
              {item.label}
            </a>
          );
        })}
      </nav>
    </aside>
  );
}
