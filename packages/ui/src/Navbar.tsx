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
}

export interface NavbarProps {
  brand?: ReactNode;
  links?: NavLink[];
  /** Right-side slot: user menu, login button, etc. */
  actions?: ReactNode;
  className?: string;
}

/**
 * Top navigation bar shared across all MFE zones.
 * Links render as plain <a> so navigating between zones does a full reload
 * (correct for Multi-Zones — each zone is a separate Next.js app).
 */
export function Navbar({ brand, links = [], actions, className }: NavbarProps) {
  return (
    <header
      className={cn(
        "sticky top-0 z-40 flex h-14 items-center gap-6 border-b border-border bg-surface px-6",
        className,
      )}
    >
      <a href="/" className="text-lg font-bold text-brand-700">
        {brand ?? "LMS"}
      </a>
      <nav className="flex items-center gap-4">
        {links.map((l) => (
          <a
            key={l.href}
            href={l.href}
            className="text-sm font-medium text-gray-600 hover:text-brand-700"
          >
            {l.label}
          </a>
        ))}
      </nav>
      <div className="ml-auto flex items-center gap-3">{actions}</div>
    </header>
  );
}
