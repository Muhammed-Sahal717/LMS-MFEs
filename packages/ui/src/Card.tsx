import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode;
  footer?: ReactNode;
}

/** Surface container with optional header/footer slots. */
export function Card({ header, footer, className, children, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        "flex flex-col rounded-[var(--radius-card)] border border-border bg-surface shadow-sm",
        className,
      )}
      {...rest}
    >
      {header ? (
        <div className="border-b border-border px-5 py-3 font-semibold text-gray-800">{header}</div>
      ) : null}
      <div className="px-5 py-4">{children}</div>
      {footer ? <div className="border-t border-border px-5 py-3">{footer}</div> : null}
    </div>
  );
}
