"use client";

import { useEffect, useState } from "react";
import { Card, Loader } from "@lms/ui";
import { dashboardApi, type DashboardSummary } from "@lms/api-client";

function StatCard({ icon, label, value }: { icon: string; label: string; value: number }) {
  return (
    <Card>
      <div className="flex items-center gap-4">
        <span className="text-3xl">{icon}</span>
        <div>
          <div className="text-2xl font-bold text-gray-900">{value}</div>
          <div className="text-sm text-gray-500">{label}</div>
        </div>
      </div>
    </Card>
  );
}

const activityIcon: Record<string, string> = {
  lesson: "✓",
  assignment: "📝",
  enrollment: "📚",
};

export default function DashboardPage() {
  const [data, setData] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    dashboardApi.summary().then(setData).catch(() => setData(null));
  }, []);

  if (!data) {
    return (
      <div className="mt-10 flex justify-center">
        <Loader size="lg" label="Loading dashboard…" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-3xl font-bold text-gray-900">Welcome {data.user.name}</h1>
      <p className="mt-2 text-gray-600">Here's your learning at a glance.</p>

      {/* Stat widgets */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard icon="📚" label="Enrolled Courses" value={data.enrolledCourses} />
        <StatCard icon="🎥" label="Completed Lessons" value={data.completedLessons} />
        <StatCard icon="📝" label="Pending Assignments" value={data.pendingAssignments} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upcoming assignments */}
        <Card header={<span>Upcoming Assignments</span>}>
          {data.upcomingAssignments.length === 0 ? (
            <p className="text-sm text-gray-500">Nothing due. Nice. 🎉</p>
          ) : (
            <ul className="flex flex-col gap-3">
              {data.upcomingAssignments.map((a) => (
                <li key={a.id} className="flex items-center justify-between">
                  <a
                    href={`/assignments/${a.id}`}
                    className="text-sm font-medium text-gray-800 hover:text-brand-700"
                  >
                    {a.title}
                  </a>
                  <span className="text-xs text-gray-500">Due {a.dueDate}</span>
                </li>
              ))}
            </ul>
          )}
        </Card>

        {/* Recent activity */}
        <Card header={<span>Recent Activity</span>}>
          <ul className="flex flex-col gap-3">
            {data.recentActivity.map((act) => (
              <li key={act.id} className="flex items-center gap-3 text-sm text-gray-700">
                <span className="text-brand-600">{activityIcon[act.type] ?? "•"}</span>
                <span className="flex-1">{act.label}</span>
                <span className="text-xs text-gray-400">
                  {new Date(act.at).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
