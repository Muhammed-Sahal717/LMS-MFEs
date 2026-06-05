import { cn } from "./cn";

export interface ProgressBarProps {
  /** 0–100 */
  value: number;
  className?: string;
  showLabel?: boolean;
}

/** Horizontal progress bar. Reused by learning + dashboard. */
export function ProgressBar({ value, className, showLabel }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value));
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-muted">
        <div
          className="h-full rounded-full bg-brand-600 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
      {showLabel ? <span className="text-xs font-medium text-gray-600">{pct}%</span> : null}
    </div>
  );
}
