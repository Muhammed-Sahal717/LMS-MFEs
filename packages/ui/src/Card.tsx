import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode;
  footer?: ReactNode;
  image?: string;
  interactive?: boolean;
}

/** Surface container with optional header/footer slots and imagery. */
export function Card({ header, footer, image, interactive, className, children, ...rest }: CardProps) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-[var(--radius-card)] border border-border bg-white shadow-sm transition-all duration-200",
        interactive && "hover:shadow-md hover:border-brand-300 cursor-pointer",
        className,
      )}
      {...rest}
    >
      {image ? (
        <div className="w-full h-40 overflow-hidden bg-gray-100">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={image} alt="Card cover" className="h-full w-full object-cover transition-transform duration-300 hover:scale-105" />
        </div>
      ) : null}
      
      {header ? (
        <div className="border-b border-gray-100 bg-gray-50/50 px-6 py-4 text-sm font-semibold text-gray-900">{header}</div>
      ) : null}
      
      <div className="flex-1 px-6 py-5">{children}</div>
      
      {footer ? <div className="border-t border-gray-100 bg-gray-50/50 px-6 py-4">{footer}</div> : null}
    </div>
  );
}
