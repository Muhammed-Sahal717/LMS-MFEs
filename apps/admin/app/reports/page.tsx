"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, Loader, EmptyState } from "@lms/ui";
import { adminApi, type ReportOut } from "@lms/api-client";
import { BookOpen, Users, GraduationCap, CheckCircle, Activity, Box } from "lucide-react";
import type { ReactNode } from "react";

function Stat({ label, value, icon, colorClass, bgClass }: { label: string; value: string | number; icon: ReactNode; colorClass: string; bgClass: string }) {
  return (
    <Card className="transition-all hover:shadow-[var(--shadow-md)] hover:border-[hsl(var(--primary)/0.5)] overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-[hsl(var(--muted-foreground))]">{label}</CardTitle>
        <div className={`p-2 rounded-[var(--radius-md)] ${bgClass} ${colorClass}`}>
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight text-[hsl(var(--foreground))]">{value}</div>
      </CardContent>
    </Card>
  );
}

export default function AdminReportsPage() {
  const [a, setA] = useState<ReportOut | null>(null);

  useEffect(() => {
    adminApi.analytics().then(setA).catch(() => setA(null));
  }, []);

  if (!a) {
    return <div className="mt-20 flex justify-center"><Loader size="lg" label="Loading analytics..." /></div>;
  }

  return (
    <div className="mx-auto max-w-6xl animate-in fade-in duration-500 pb-12">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[hsl(var(--foreground))] tracking-tight">Platform Analytics</h1>
          <p className="mt-2 text-[hsl(var(--muted-foreground))]">Monitor course performance and student engagement across your platform.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Stat 
          label="Total Courses" 
          value={a.courses} 
          icon={<BookOpen className="w-5 h-5" />} 
          colorClass="text-[hsl(var(--primary))]" 
          bgClass="bg-[hsl(var(--primary)/0.15)]" 
        />
        <Stat 
          label="Registered Students" 
          value={a.users} 
          icon={<Users className="w-5 h-5" />} 
          colorClass="text-indigo-600 dark:text-indigo-400" 
          bgClass="bg-indigo-100 dark:bg-indigo-900/30" 
        />
        <Stat 
          label="Course Enrollments" 
          value={a.enrollments} 
          icon={<GraduationCap className="w-5 h-5" />} 
          colorClass="text-emerald-600 dark:text-emerald-400" 
          bgClass="bg-emerald-100 dark:bg-emerald-900/30" 
        />
        <Stat 
          label="Total Submissions" 
          value={a.submissions} 
          icon={<CheckCircle className="w-5 h-5" />} 
          colorClass="text-amber-600 dark:text-amber-400" 
          bgClass="bg-amber-100 dark:bg-amber-900/30" 
        />
      </div>

      <div className="mt-8">
        <Card className="h-full border-[hsl(var(--border))] shadow-sm">
          <CardHeader className="bg-[hsl(var(--muted)/0.3)] border-b border-[hsl(var(--border))]">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Activity className="w-5 h-5 text-[hsl(var(--primary))]" />
              Active Modules
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            {a.active_modules && a.active_modules.length > 0 ? (
              <div className="flex flex-wrap gap-3">
                {a.active_modules.map((m) => (
                  <div key={m} className="flex items-center gap-2 rounded-full border border-[hsl(var(--border))] bg-[hsl(var(--background))] px-4 py-2 shadow-sm">
                    <Box className="w-4 h-4 text-[hsl(var(--muted-foreground))]" />
                    <span className="text-sm font-semibold text-[hsl(var(--foreground))]">{m}</span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState 
                icon={<Box className="w-8 h-8" />}
                title="No active modules"
                description="There are currently no active modules enabled on your tenant."
                variant="dashed"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
