import { type HTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./cn";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap transition-colors",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-sm hover:bg-[hsl(var(--primary)/0.8)]",
        secondary:
          "border-transparent bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] shadow-sm hover:bg-[hsl(var(--secondary)/0.8)]",
        destructive:
          "border-transparent bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] shadow-sm hover:bg-[hsl(var(--destructive)/0.8)]",
        outline:
          "border-[hsl(var(--border))] text-[hsl(var(--foreground))] shadow-sm",
        // LMS semantic variants using full 50-950 scales
        success:
          "border-success-200 bg-success-50 text-success-700 dark:border-success-800/50 dark:bg-success-950/50 dark:text-success-400",
        warning:
          "border-warning-200 bg-warning-50 text-warning-700 dark:border-warning-800/50 dark:bg-warning-950/50 dark:text-warning-400",
        danger:
          "border-danger-200 bg-danger-50 text-danger-700 dark:border-danger-800/50 dark:bg-danger-950/50 dark:text-danger-400",
        info:
          "border-info-200 bg-info-50 text-info-700 dark:border-info-800/50 dark:bg-info-950/50 dark:text-info-400",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ variant = "default", className, children, ...rest }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...rest}>
      {children}
    </span>
  );
}

export { badgeVariants };
