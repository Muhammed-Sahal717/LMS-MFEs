import { cn } from "./cn";
import { Loader2 } from "lucide-react";

export interface LoaderProps {
  size?: "sm" | "md" | "lg";
  className?: string;
  label?: string;
}

const sizes = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-10 w-10",
} as const;

/** Token-based spinner using Shadcn/Vercel style SVG. */
export function Loader({ size = "md", className, label }: LoaderProps) {
  return (
    <span role="status" className={cn("inline-flex items-center gap-3", className)}>
      <Loader2
        className={cn(
          "animate-spin text-[hsl(var(--primary))]",
          sizes[size]
        )}
      />
      {label ? (
        <span className="text-sm font-medium animate-pulse text-[hsl(var(--muted-foreground))] tracking-wide">
          {label}
        </span>
      ) : null}
      <span className="sr-only">Loading</span>
    </span>
  );
}
