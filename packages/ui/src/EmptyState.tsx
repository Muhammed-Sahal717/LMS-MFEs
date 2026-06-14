import type { ReactNode } from "react";
import { cn } from "./cn";

export interface EmptyStateProps {
  icon?: ReactNode;
  title: string;
  description?: string;
  action?: ReactNode;
  className?: string;
  /** Visual style variant */
  variant?: "default" | "dashed";
}

/**
 * Reusable empty state pattern.
 * Displays when a list, table, or content area has nothing to show.
 */
export function EmptyState({
  icon,
  title,
  description,
  action,
  className,
  variant = "default",
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center py-12 px-6 text-center",
        variant === "dashed" &&
          "rounded-[var(--radius-xl)] border-2 border-dashed border-[hsl(var(--border))]",
        className,
      )}
    >
      {icon ? (
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))]">
          {icon}
        </div>
      ) : null}
      <h3 className="text-base font-semibold text-[hsl(var(--foreground))]">{title}</h3>
      {description ? (
        <p className="mt-1.5 max-w-[300px] text-sm text-[hsl(var(--muted-foreground))]">
          {description}
        </p>
      ) : null}
      {action ? <div className="mt-6">{action}</div> : null}
    </div>
  );
}
