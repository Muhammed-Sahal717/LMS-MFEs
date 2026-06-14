"use client";

import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, Loader } from "@lms/ui";
import { adminApi, type ReportOut } from "@lms/api-client";

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <Card className="transition-all hover:shadow-[var(--shadow-md)] hover:border-[hsl(var(--primary)/0.5)]">
      <CardContent className="p-6">
        <div className="text-3xl font-bold text-[hsl(var(--foreground))]">{value}</div>
        <div className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">{label}</div>
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
    return <div className="mt-10 flex justify-center"><Loader size="lg" /></div>;
  }

  return (
    <div className="animate-in fade-in duration-500">
      <h1 className="text-3xl font-extrabold text-[hsl(var(--foreground))] tracking-tight">Reports</h1>

      <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-4">
        <Stat label="Courses" value={a.courses} />
        <Stat label="Students" value={a.users} />
        <Stat label="Enrollments" value={a.enrollments} />
        <Stat label="Submissions" value={a.submissions} />
      </div>

      {a.active_modules && a.active_modules.length > 0 && (
        <Card className="mt-6 transition-all hover:shadow-[var(--shadow-md)]">
          <CardHeader>
            <CardTitle>Active Modules</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {a.active_modules.map((m) => (
                <span key={m} className="rounded-full bg-[hsl(var(--primary)/0.15)] px-3 py-1 text-sm font-medium text-[hsl(var(--primary))]">
                  {m}
                </span>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
