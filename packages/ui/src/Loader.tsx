import { cn } from "./cn";

export interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

const sizes = {
  sm: "h-4 w-4 border-2",
  md: "h-5 w-5 border-2",
  lg: "h-10 w-10 border-[3px]",
} as const;

/** Token-based spinner. Used by Button's loading state. */
export function Loader({ size = "md", className, label }: LoaderProps) {
  return (
    <span role="status" className={cn("inline-flex items-center gap-2", className)}>
      <span
        className={cn(
          "animate-spin rounded-full",
          "border-[hsl(var(--muted))] border-t-[hsl(var(--primary))]",
          sizes[size],
        )}
      />
      {label ? (
        <span className="text-sm text-[hsl(var(--muted-foreground))]">{label}</span>
      ) : null}
      <span className="sr-only">Loading</span>
    </span>
  );
}
