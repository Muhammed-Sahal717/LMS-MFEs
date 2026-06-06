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
      <div className="mb-8 text-center">
        <div className="text-3xl font-extrabold text-brand-700 tracking-tight">LMS</div>
      </div>
      <div className="rounded-[var(--radius-card)] border border-gray-200 bg-white shadow-xl px-8 py-10">
        <h1 className="text-2xl font-bold text-gray-900 text-center tracking-tight">{title}</h1>
        {subtitle ? <p className="mt-2 text-sm text-gray-500 text-center">{subtitle}</p> : null}
        <div className="mt-8">{children}</div>
      </div>
      {footer ? <div className="mt-6 text-center text-sm text-gray-500 hover:text-gray-900 transition-colors">{footer}</div> : null}
    </div>
  );
}
