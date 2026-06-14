import { forwardRef, type ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "./cn";
import { Loader } from "./Loader";

const buttonVariants = cva(
  // Base classes
  [
    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)]",
    "text-sm font-medium transition-all duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))] focus-visible:ring-offset-2 focus-visible:ring-offset-[hsl(var(--background))]",
    "disabled:pointer-events-none disabled:opacity-50",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0",
  ],
  {
    variants: {
      variant: {
        default:
          "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-sm hover:bg-[hsl(var(--primary)/0.9)] active:scale-[0.98]",
        destructive:
          "bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] shadow-sm hover:bg-[hsl(var(--destructive)/0.9)] active:scale-[0.98]",
        outline:
          "border border-[hsl(var(--border))] bg-[hsl(var(--background))] text-[hsl(var(--foreground))] shadow-sm hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]",
        secondary:
          "bg-[hsl(var(--secondary))] text-[hsl(var(--secondary-foreground))] shadow-sm hover:bg-[hsl(var(--secondary)/0.8)] active:scale-[0.98]",
        ghost:
          "text-[hsl(var(--foreground))] hover:bg-[hsl(var(--accent))] hover:text-[hsl(var(--accent-foreground))]",
        link:
          "text-[hsl(var(--primary))] underline-offset-4 hover:underline",
        // Backward compat aliases
        primary:
          "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))] shadow-sm hover:bg-[hsl(var(--primary)/0.9)] active:scale-[0.98]",
        danger:
          "bg-[hsl(var(--destructive))] text-[hsl(var(--destructive-foreground))] shadow-sm hover:bg-[hsl(var(--destructive)/0.9)] active:scale-[0.98]",
      },
      size: {
        default: "h-9 px-4 py-2",
        sm: "h-8 rounded-[var(--radius-sm)] px-3 text-xs",
        md: "h-9 px-4 text-sm",
        lg: "h-11 rounded-[var(--radius-lg)] px-8 text-base",
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  loading?: boolean;
  fullWidth?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = "default", size = "default", loading, fullWidth, disabled, className, children, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(buttonVariants({ variant, size }), fullWidth && "w-full", className)}
      {...rest}
    >
      {loading ? <Loader size="sm" /> : null}
      {children}
    </button>
  );
});

Button.displayName = "Button";
export { Button, buttonVariants };
