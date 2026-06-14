import { cn } from "./cn";

export interface ProgressBarProps {
  /** 0–100 */
  value: number;
  className?: string;
  showLabel?: boolean;
}

/** Horizontal progress bar with token-based colors. */
export function ProgressBar({ value, className, showLabel }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-[hsl(var(--muted))]">
        <div
          className="h-full rounded-full bg-[hsl(var(--primary))] transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel ? (
        <span className="text-xs font-medium tabular-nums text-[hsl(var(--muted-foreground))]">
          {pct}%
        </span>
      ) : null}
    </div>
  );
}
