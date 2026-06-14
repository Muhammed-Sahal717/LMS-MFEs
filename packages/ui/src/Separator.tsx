import { cn } from "./cn";

export interface SeparatorProps {
  orientation?: "horizontal" | "vertical";
  className?: string;
}

/** Visual divider using the --border token. */
export function Separator({ orientation = "horizontal", className }: SeparatorProps) {
  return (
    <div
      role="separator"
      aria-orientation={orientation}
      className={cn(
        "shrink-0 bg-[hsl(var(--border))]",
        orientation === "horizontal" ? "h-px w-full" : "h-full w-px",
        className,
      )}
    />
  );
}
