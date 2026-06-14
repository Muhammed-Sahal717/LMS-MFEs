"use client";

import { forwardRef, useId, useState, type InputHTMLAttributes } from "react";
import { cn } from "./cn";
import { Eye, EyeOff } from "lucide-react";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, error, helperText, id, className, type, ...rest },
  ref,
) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";
  const currentType = isPassword ? (showPassword ? "text" : "password") : type;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      {label ? (
        <label
          htmlFor={inputId}
          className="text-sm font-medium leading-none text-[hsl(var(--foreground))] peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          {label}
        </label>
      ) : null}
      <div className="relative w-full">
        <input
          ref={ref}
          id={inputId}
          type={currentType}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : helperText ? `${inputId}-hint` : undefined}
          className={cn(
            "flex h-9 w-full rounded-[var(--radius-md)] border border-[hsl(var(--input))]",
            "bg-transparent px-3 py-1 text-sm text-[hsl(var(--foreground))]",
            "shadow-sm transition-colors",
            "placeholder:text-[hsl(var(--muted-foreground))]",
            "file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-[hsl(var(--foreground))]",
            "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[hsl(var(--ring))]",
            "disabled:cursor-not-allowed disabled:opacity-50",
            error
              ? "border-[hsl(var(--destructive))] focus-visible:ring-[hsl(var(--destructive))]"
              : "border-[hsl(var(--input))]",
            isPassword ? "pr-10" : "",
            className,
          )}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
        )}
      </div>
      {error ? (
        <p id={`${inputId}-error`} className="text-xs text-[hsl(var(--destructive))]">
          {error}
        </p>
      ) : helperText ? (
        <p id={`${inputId}-hint`} className="text-xs text-[hsl(var(--muted-foreground))]">
          {helperText}
        </p>
      ) : null}
    </div>
  );
});
