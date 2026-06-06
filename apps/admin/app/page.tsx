"use client";

import Link from "next/link";
import { Card } from "@lms/ui";
import { BookOpen, Users, BarChart3 } from "lucide-react";

const tiles = [
  { href: "/courses", icon: <BookOpen />, title: "Courses", desc: "Create courses, manage lessons." },
  { href: "/users", icon: <Users />, title: "Users", desc: "Manage students and instructors." },
  { href: "/reports", icon: <BarChart3 />, title: "Reports", desc: "Platform analytics." },
];

export default function AdminOverview() {
  return (
    <div className="mx-auto max-w-6xl animate-in fade-in duration-500">
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Admin Control Center</h1>
        <p className="mt-2 text-gray-500">Manage instructors, students, and platform configurations.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {tiles.map((t) => (
          <Link key={t.href} href={t.href} className="group">
            <Card interactive className="h-full group-hover:border-brand-300">
              <div className="flex items-center gap-4 mb-3">
                <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-600 group-hover:bg-brand-50 group-hover:text-brand-600 transition-colors">
                  {t.icon}
                </span>
                <span className="text-lg font-bold text-gray-900 group-hover:text-brand-600 transition-colors">{t.title}</span>
              </div>
              <p className="text-sm text-gray-500">{t.desc}</p>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
