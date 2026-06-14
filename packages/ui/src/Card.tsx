import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "./cn";

/* ─── Compound Card components (shadcn pattern) ─── */

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "rounded-[var(--radius-xl)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] shadow-[var(--shadow-card)]",
        className,
      )}
      {...props}
    />
  );
}

export function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex flex-col space-y-1.5 p-6", className)}
      {...props}
    />
  );
}

export function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3
      className={cn("font-semibold leading-none tracking-tight", className)}
      {...props}
    />
  );
}

export function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p
      className={cn("text-sm text-[hsl(var(--muted-foreground))]", className)}
      {...props}
    />
  );
}

export function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("p-6 pt-0", className)}
      {...props}
    />
  );
}

export function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("flex items-center p-6 pt-0", className)}
      {...props}
    />
  );
}

/* ─── Legacy single-component API (backward compat) ─── */

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  header?: ReactNode;
  footer?: ReactNode;
  image?: string;
  interactive?: boolean;
}

/**
 * Simple Card wrapper — backward-compatible with existing callers.
 * New code should prefer the compound components above.
 */
export function SimpleCard({
  header,
  footer,
  image,
  interactive,
  className,
  children,
  ...rest
}: CardProps) {
  return (
    <div
      className={cn(
        "flex flex-col overflow-hidden rounded-[var(--radius-xl)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] shadow-[var(--shadow-card)] transition-all duration-200",
        interactive &&
          "hover:shadow-[var(--shadow-md)] hover:border-[hsl(var(--primary)/0.4)] cursor-pointer",
        className,
      )}
      {...rest}
    >
      {image ? (
        <div className="w-full aspect-video overflow-hidden bg-[hsl(var(--muted))]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={image}
            alt="Card cover"
            className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      ) : null}

      {header ? (
        <div className="border-b border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.4)] px-6 py-4 text-sm font-semibold text-[hsl(var(--card-foreground))]">
          {header}
        </div>
      ) : null}

      <div className="flex-1 px-6 py-5">{children}</div>

      {footer ? (
        <div className="border-t border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.4)] px-6 py-4">
          {footer}
        </div>
      ) : null}
    </div>
  );
}
