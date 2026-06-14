import type { ReactNode } from "react";
import { cn } from "./cn";

export interface NavLink {
  label: string;
  /** Absolute path. Cross-zone links use <a> (hard nav) by design. */
  href: string;
  /** Required permission to show this link (omitted = always shown). */
  permission?: string;
  /** Required module code to show this link (omitted = always shown). */
  module?: string;
  /** If provided, user must possess AT LEAST ONE of these role codes. */
  roles?: string[];
}

export interface NavbarProps {
  brand?: ReactNode;
  links?: NavLink[];
  /** Right-side slot: user menu, login button, theme toggle, etc. */
  actions?: ReactNode;
  className?: string;
}

/**
 * Top navigation bar shared across all MFE zones.
 * Links render as plain <a> so navigating between zones does a full reload
 * (correct for Multi-Zones — each zone is a separate Next.js app).
 * Glassmorphism sticky header with dark mode support.
 */
export function Navbar({ brand, links = [], actions, className }: NavbarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 h-14 w-full",
        "border-b border-[hsl(var(--border))]",
        "bg-[hsl(var(--background)/0.8)] backdrop-blur-md",
        "supports-[backdrop-filter]:bg-[hsl(var(--background)/0.6)]",
        className,
      )}
    >
      <div className="flex h-full items-center gap-6 px-6">
        {/* Brand */}
        <a
          href="/"
          className="flex items-center gap-2 text-lg font-bold text-[hsl(var(--foreground))] transition-opacity hover:opacity-80"
        >
          <span className="inline-flex h-7 w-7 items-center justify-center rounded-lg bg-[hsl(var(--primary))] text-xs font-black text-[hsl(var(--primary-foreground))]">
            L
          </span>
          {brand ?? "LMS"}
        </a>

        {/* Divider */}
        {links.length > 0 && (
          <div className="h-5 w-px bg-[hsl(var(--border))]" aria-hidden="true" />
        )}

        {/* Nav links */}
        <nav className="flex items-center gap-1">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className={cn(
                "rounded-[var(--radius-sm)] px-3 py-1.5",
                "text-sm font-medium text-[hsl(var(--muted-foreground))]",
                "transition-colors hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]",
              )}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Right slot */}
        <div className="ml-auto flex items-center gap-2">{actions}</div>
      </div>
    </header>
  );
}
