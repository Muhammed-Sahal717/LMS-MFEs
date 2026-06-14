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
  /** If provided, user must possess AT LEAST ONE of these role codes. */
  roles?: string[];
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
 * Uses sidebar-specific CSS tokens for deep background theming.
 */
export function Sidebar({ items, activeHref, className }: SidebarProps) {
  return (
    <aside
      className={cn(
        "w-[220px] shrink-0 flex flex-col",
        "border-r border-[hsl(var(--sidebar-border))]",
        "bg-[hsl(var(--sidebar))]",
        "text-[hsl(var(--sidebar-foreground))]",
        "min-h-screen",
        className,
      )}
    >
      {/* Scroll area */}
      <div className="flex-1 overflow-y-auto py-4 px-3">
        <nav className="flex flex-col gap-0.5" aria-label="Sidebar navigation">
          {items.map((item) => {
            const active =
              activeHref === item.href ||
              (item.href !== "/" && activeHref?.startsWith(item.href));
            return (
              <a
                key={item.href}
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "group flex items-center gap-3 rounded-[var(--radius-md)] px-3 py-2",
                  "text-sm font-medium transition-all duration-150",
                  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-inset",
                  active
                    ? [
                        "bg-[hsl(var(--sidebar-accent)/0.15)] text-[hsl(var(--sidebar-accent))]",
                        "[&_svg]:text-[hsl(var(--sidebar-accent))]",
                      ]
                    : [
                        "text-[hsl(var(--sidebar-muted-foreground))]",
                        "hover:bg-[hsl(var(--sidebar-accent)/0.1)] hover:text-[hsl(var(--sidebar-foreground))]",
                        "[&_svg]:text-[hsl(var(--sidebar-muted-foreground))] hover:[&_svg]:text-[hsl(var(--sidebar-foreground))]",
                      ],
                )}
              >
                {item.icon ? (
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center transition-colors">
                    {item.icon}
                  </span>
                ) : null}
                <span className="truncate">{item.label}</span>
              </a>
            );
          })}
        </nav>
      </div>

      {/* Bottom footer area */}
      <div className="border-t border-[hsl(var(--sidebar-border))] p-3">
        <div className="text-[10px] font-medium uppercase tracking-widest text-[hsl(var(--sidebar-muted-foreground)/0.6)]">
          LMS Platform
        </div>
      </div>
    </aside>
  );
}
