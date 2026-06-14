import type { ReactNode } from "react";

/** Shared frame for all auth screens. */
export function AuthCard({
  title,
  subtitle,
  children,
  footer,
}: {
  title: string;
  subtitle?: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="w-full max-w-md animate-in fade-in duration-500 slide-in-from-bottom-4">
      <div className="mb-8 flex justify-center">
        <a href="/" className="flex items-center gap-2 font-bold text-[hsl(var(--foreground))] text-2xl">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[hsl(var(--primary))] text-sm font-black text-[hsl(var(--primary-foreground))]">
            L
          </span>
          LMS
        </a>
      </div>
      <div className="rounded-[var(--radius-xl)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] text-[hsl(var(--card-foreground))] shadow-[var(--shadow-xl)] px-8 py-10">
        <h1 className="text-2xl font-semibold tracking-tight text-center">{title}</h1>
        {subtitle ? <p className="mt-2 text-sm text-[hsl(var(--muted-foreground))] text-center">{subtitle}</p> : null}
        <div className="mt-8">{children}</div>
      </div>
      {footer ? <div className="mt-6 text-center text-sm text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">{footer}</div> : null}
    </div>
  );
}
