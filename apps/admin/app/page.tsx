"use client";

import Link from "next/link";
import { Card } from "@lms/ui";

const tiles = [
  { href: "/courses", icon: "📚", title: "Courses", desc: "Create courses, manage lessons." },
  { href: "/users", icon: "👥", title: "Users", desc: "Manage students and instructors." },
  { href: "/reports", icon: "📈", title: "Reports", desc: "Platform analytics." },
];

export default function AdminOverview() {
  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Admin</h1>
      <p className="mt-2 text-gray-600">Instructor & platform management.</p>

      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        {tiles.map((t) => (
          <Link key={t.href} href={t.href}>
            <Card header={<span>{t.icon} {t.title}</span>} className="h-full transition-shadow hover:shadow-md">
              <p className="text-sm text-gray-600">{t.desc}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
