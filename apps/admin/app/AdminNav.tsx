"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@lms/ui";

// Internal admin routes → soft <Link> nav (same zone).
const tabs = [
  { label: "Overview", href: "/" },
  { label: "Courses", href: "/courses" },
  { label: "Users", href: "/users" },
  { label: "Reports", href: "/reports" },
];

export function AdminNav() {
  // usePathname includes basePath (/admin). Strip it to compare with tab hrefs.
  const pathname = usePathname().replace(/^\/admin/, "") || "/";
  return (
    <nav className="mb-6 flex gap-1 border-b border-border">
      {tabs.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={cn(
              "border-b-2 px-4 py-2 text-sm font-medium transition-colors",
              active
                ? "border-brand-600 text-brand-700"
                : "border-transparent text-gray-500 hover:text-gray-800",
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
