import { forwardRef, useId, type SelectHTMLAttributes } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "./cn";

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

/**
 * Styled native <select> with chevron icon.
 * Uses shadcn token-based styling and dark mode support.
 * Preserves all native behavior including option lists.
 */
export const Select = forwardRef<HTMLSelectElement, SelectProps>(function Select(
  { label, error, helperText, id, className, children, ...rest },
  ref,
) {
  const autoId = useId();
  const selectId = id ?? autoId;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label ? (
        <label
          htmlFor={selectId}
          className="text-sm font-medium leading-none text-[hsl(var(--foreground))]"
        >
          {label}
        </label>
      ) : null}
      <div className="relative w-full">
        <select
          ref={ref}
          id={selectId}
          aria-invalid={!!error}
          className={cn(
            "flex h-9 w-full appearance-none rounded-[var(--radius-md)] border border-[hsl(var(--input))]",
            "bg-transparent px-3 py-1 pr-8 text-sm text-[hsl(var(--foreground))]",
            "shadow-sm transition-colors",
            "placeholder:text-[hsl(var(--muted-foreground))]",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[hsl(var(--ring))]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-[hsl(var(--destructive))] focus-visible:ring-[hsl(var(--destructive))]"
              : "",
            className,
          )}
          {...rest}
        >
          {children}
        </select>
        <ChevronDown
          size={14}
          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[hsl(var(--muted-foreground))]"
        />
      </div>
      {error ? (
        <p className="text-xs text-[hsl(var(--destructive))]">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-[hsl(var(--muted-foreground))]">{helperText}</p>
      ) : null}
    </div>
  );
});
