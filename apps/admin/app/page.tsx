"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@lms/ui";
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
        <h1 className="text-3xl font-extrabold text-[hsl(var(--foreground))] tracking-tight">Admin Control Center</h1>
        <p className="mt-2 text-[hsl(var(--muted-foreground))]">Manage instructors, students, and platform configurations.</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        {tiles.map((t) => (
          <Link key={t.href} href={t.href} className="group">
            <Card className="h-full transition-colors group-hover:border-[hsl(var(--primary)/0.5)] group-hover:shadow-[var(--shadow-md)]">
              <CardHeader>
                <div className="flex items-center gap-4 mb-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] group-hover:bg-[hsl(var(--primary)/0.1)] group-hover:text-[hsl(var(--primary))] transition-colors">
                    {t.icon}
                  </span>
                  <CardTitle className="text-lg transition-colors group-hover:text-[hsl(var(--primary))]">{t.title}</CardTitle>
                </div>
                <CardDescription>{t.desc}</CardDescription>
              </CardHeader>
            </Card>
          </Link>
        ))}
      </div>
    </div>
  );
}
