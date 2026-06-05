"use client";

import { useEffect, useState } from "react";
import { Card, Loader } from "@lms/ui";
import { dashboardApi, type DashboardOut } from "@lms/api-client";

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
  const [data, setData] = useState<DashboardOut | null>(null);

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
      <h1 className="text-3xl font-bold text-gray-900">Welcome back</h1>
      <p className="mt-2 text-gray-600">Here's your learning at a glance.</p>

      {/* Stat widgets */}
      <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <StatCard icon="📚" label="Enrolled Courses" value={data.enrolled_courses} />
        <StatCard icon="🎥" label="Completed Lessons" value={data.completed_lessons} />
        <StatCard icon="📝" label="Pending Assignments" value={data.pending_assignments} />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Upcoming assignments */}
        <Card header={<span>Upcoming Assignments</span>}>
          {data.pending_assignments === 0 ? (
            <p className="text-sm text-gray-500">Nothing due. Nice. 🎉</p>
          ) : (
            <p className="text-sm text-gray-500">Check Assignments for due items.</p>
          )}
        </Card>

        {/* Recent activity */}
        <Card header={<span>Recent Activity</span>}>
          <ul className="flex flex-col gap-3">
            {data.recent_activity.map((act, index) => (
              <li key={`${act.resource_id ?? "activity"}-${index}`} className="flex items-center gap-3 text-sm text-gray-700">
                <span className="text-brand-600">{activityIcon[act.resource] ?? "•"}</span>
                <span className="flex-1">{act.action} {act.resource}</span>
                <span className="text-xs text-gray-400">
                  {new Date(act.created_at).toLocaleDateString()}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      </div>
    </div>
  );
}
