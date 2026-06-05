import type { ReactNode } from "react";
import { Card } from "@lms/ui";

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
    <div className="w-full max-w-md">
      <div className="mb-6 text-center">
        <div className="text-2xl font-bold text-brand-700">LMS</div>
      </div>
      <Card>
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-gray-500">{subtitle}</p> : null}
        <div className="mt-6">{children}</div>
        {footer ? <div className="mt-6 text-center text-sm text-gray-600">{footer}</div> : null}
      </Card>
    </div>
  );
}
