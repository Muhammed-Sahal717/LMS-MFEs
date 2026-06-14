import { cn } from "./cn";

export interface SkeletonProps {
  className?: string;
}

/**
 * Skeleton loading shimmer — use in place of content while data is loading.
 * Renders an animated pulse placeholder matching shadcn Skeleton.
 */
export function Skeleton({ className }: SkeletonProps) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-[var(--radius-md)] bg-[hsl(var(--muted))]",
        className,
      )}
    />
  );
}
