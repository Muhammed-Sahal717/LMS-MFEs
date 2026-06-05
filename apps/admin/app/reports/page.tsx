"use client";

import { useEffect, useState } from "react";
import { Card, Loader } from "@lms/ui";
import { adminApi, type ReportOut } from "@lms/api-client";

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
      <div className="mt-1 text-sm text-gray-500">{label}</div>
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
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Reports</h1>

      <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-4">
        <Stat label="Courses" value={a.courses} />
        <Stat label="Students" value={a.users} />
        <Stat label="Enrollments" value={a.enrollments} />
        <Stat label="Submissions" value={a.submissions} />
      </div>

      {a.active_modules && a.active_modules.length > 0 && (
        <Card className="mt-6" header={<span>Active Modules</span>}>
          <div className="flex flex-wrap gap-2">
            {a.active_modules.map((m) => (
              <span key={m} className="rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">
                {m}
              </span>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}

