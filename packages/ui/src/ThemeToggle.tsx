"use client";

import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { cn } from "./cn";

export interface ThemeToggleProps {
  className?: string;
}

/**
 * Light/Dark mode toggle button.
 * Uses next-themes `useTheme` hook. Place in the Navbar actions slot.
 */
export function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();

  function toggle() {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  }

  return (
    <button
      onClick={toggle}
      aria-label={resolvedTheme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
      className={cn(
        "inline-flex h-8 w-8 items-center justify-center rounded-[var(--radius-md)]",
        "text-[hsl(var(--muted-foreground))] transition-colors",
        "hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]",
        className,
      )}
    >
      {/* Sun visible in dark mode (click to switch to light) */}
      <Sun
        size={16}
        className="rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
      />
      {/* Moon visible in light mode (click to switch to dark) */}
      <Moon
        size={16}
        className="absolute rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
      />
    </button>
  );
}
