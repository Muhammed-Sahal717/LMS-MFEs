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
        <label htmlFor={inputId} className="text-sm font-medium text-gray-700">
          {label}
        </label>
      ) : null}
      <div className="relative w-full">
        <input
          ref={ref}
          id={inputId}
          type={currentType}
          aria-invalid={!!error}
          className={cn(
            "h-10 w-full rounded-lg border bg-white px-3 text-sm text-gray-900 placeholder:text-gray-400",
            "focus:outline-none focus:ring-2 focus:ring-brand-500",
            error ? "border-red-500 focus:ring-red-500" : "border-border",
            isPassword ? "pr-10" : "",
            className,
          )}
          {...rest}
        />
        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600 focus:outline-none"
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </div>
      {error ? (
        <p className="text-xs text-red-600">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-gray-500">{helperText}</p>
      ) : null}
    </div>
  );
});
