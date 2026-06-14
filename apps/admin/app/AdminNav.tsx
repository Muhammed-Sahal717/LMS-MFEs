"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@lms/ui";
import { useAuth } from "@lms/api-client";

// Internal admin routes → soft <Link> nav (same zone).
const tabs = [
  { label: "Overview", href: "/", roles: ["super_admin", "admin", "tenant_admin", "instructor"] },
  { label: "Tenants", href: "/tenants", roles: ["super_admin"] },
  { label: "Courses", href: "/courses", roles: ["super_admin", "admin", "tenant_admin", "instructor"] },
  { label: "Users", href: "/users", roles: ["super_admin", "admin", "tenant_admin", "instructor"] }, // Instructors can invite students per user request
  { label: "Reports", href: "/reports", roles: ["super_admin", "admin", "tenant_admin"] },
];

export function AdminNav() {
  const { user } = useAuth();
  // usePathname includes basePath (/admin). Strip it to compare with tab hrefs.
  const pathname = usePathname().replace(/^\/admin/, "") || "/";
  
  const userRoleCodes = user?.roles.map(r => r.code) || [];
  const visibleTabs = tabs.filter(t => t.roles.some(r => userRoleCodes.includes(r)));
  return (
    <nav className="mb-6 flex gap-1 border-b border-[hsl(var(--border))]">
      {visibleTabs.map((t) => {
        const active = pathname === t.href;
        return (
          <Link
            key={t.href}
            href={t.href}
            className={cn(
              "border-b-2 px-4 py-2 text-sm font-medium transition-colors",
              active
                ? "border-[hsl(var(--primary))] text-[hsl(var(--primary))]"
                : "border-transparent text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))]",
            )}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
