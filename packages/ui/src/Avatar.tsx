import type { HTMLAttributes } from "react";
import { cn } from "./cn";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  /** Display name — initials are auto-generated from first letters of words. */
  name?: string;
  /** Optional image src. If provided, shown instead of initials. */
  src?: string;
  size?: "sm" | "md" | "lg";
}

const sizeClasses = {
  sm: "h-7 w-7 text-xs",
  md: "h-9 w-9 text-sm",
  lg: "h-11 w-11 text-base",
};

function getInitials(name?: string) {
  if (!name) return "?";
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? "")
    .join("");
}

/**
 * Avatar — shows an image if `src` provided, otherwise renders initials.
 * Uses the primary color for the initials background.
 */
export function Avatar({ name, src, size = "md", className, ...props }: AvatarProps) {
  return (
    <div
      className={cn(
        "relative flex shrink-0 overflow-hidden rounded-full",
        "bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))]",
        "font-semibold select-none",
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {src ? (
        /* eslint-disable-next-line @next/next/no-img-element */
        <img
          src={src}
          alt={name ?? "Avatar"}
          className="h-full w-full object-cover"
        />
      ) : (
        <span className="flex h-full w-full items-center justify-center">
          {getInitials(name)}
        </span>
      )}
    </div>
  );
}
