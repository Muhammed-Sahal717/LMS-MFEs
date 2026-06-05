"use client";

import { useEffect, useState } from "react";
import { Card, Loader, ProgressBar } from "@lms/ui";
import { adminApi, type AdminAnalytics } from "@lms/api-client";

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <Card>
      <div className="text-3xl font-bold text-gray-900">{value}</div>
      <div className="mt-1 text-sm text-gray-500">{label}</div>
    </Card>
  );
}

export default function AdminReportsPage() {
  const [a, setA] = useState<AdminAnalytics | null>(null);

  useEffect(() => {
    adminApi.analytics().then(setA).catch(() => setA(null));
  }, []);

  if (!a) {
    return <div className="mt-10 flex justify-center"><Loader size="lg" /></div>;
  }

  const maxLessons = Math.max(1, ...a.enrollmentsByCourse.map((c) => c.lessons));

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900">Reports</h1>

      <div className="mt-6 grid grid-cols-2 gap-5 sm:grid-cols-4">
        <Stat label="Courses" value={a.totalCourses} />
        <Stat label="Students" value={a.totalStudents} />
        <Stat label="Lessons" value={a.totalLessons} />
        <Stat label="Completion" value={`${a.completionRate}%`} />
      </div>

      <Card className="mt-6" header={<span>Lessons per course</span>}>
        <div className="flex flex-col gap-4">
          {a.enrollmentsByCourse.map((c) => (
            <div key={c.title}>
              <div className="mb-1 flex justify-between text-sm">
                <span className="text-gray-700">{c.title}</span>
                <span className="text-gray-400">{c.lessons}</span>
              </div>
              <ProgressBar value={(c.lessons / maxLessons) * 100} />
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
