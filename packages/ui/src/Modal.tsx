"use client";

import { useEffect, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "./cn";

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: ReactNode;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
  /** Width variant */
  size?: "sm" | "md" | "lg" | "xl";
}

const modalSizes = {
  sm: "max-w-sm",
  md: "max-w-lg",
  lg: "max-w-2xl",
  xl: "max-w-4xl",
};

/** Portal dialog. Closes on Escape and backdrop click. Fully dark-mode compatible. */
export function Modal({ open, onClose, title, children, footer, className, size = "md" }: ModalProps) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="presentation"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Dialog */}
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className={cn(
          "relative z-10 w-full animate-in fade-in slide-in-from-bottom-4 duration-300",
          "rounded-[var(--radius-xl)] border border-[hsl(var(--border))]",
          "bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))]",
          "shadow-[var(--shadow-xl)]",
          modalSizes[size],
          className,
        )}
      >
        {/* Header */}
        {title ? (
          <div className="flex items-center justify-between border-b border-[hsl(var(--border))] px-6 py-4">
            <h2 className="text-lg font-semibold leading-none tracking-tight text-[hsl(var(--foreground))]">
              {title}
            </h2>
            <button
              onClick={onClose}
              aria-label="Close dialog"
              className={cn(
                "rounded-[var(--radius-sm)] p-1.5 transition-colors",
                "text-[hsl(var(--muted-foreground))] hover:bg-[hsl(var(--muted))] hover:text-[hsl(var(--foreground))]",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-[hsl(var(--ring))]",
              )}
            >
              <X size={18} />
            </button>
          </div>
        ) : null}

        {/* Body */}
        <div className="px-6 py-5">{children}</div>

        {/* Footer */}
        {footer ? (
          <div className="flex items-center justify-end gap-2 border-t border-[hsl(var(--border))] px-6 py-4">
            {footer}
          </div>
        ) : null}
      </div>
    </div>,
    document.body,
  );
}
