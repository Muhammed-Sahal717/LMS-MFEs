"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Card, Loader, Badge, Button } from "@lms/ui";
import { dashboardApi, useAuth, type DashboardOut } from "@lms/api-client";
import { BookOpen, Video, FileText, Clock, CheckCircle, Activity, Rocket, Circle, Hand } from "lucide-react";

function StatCard({ icon, label, value, colorClass }: { icon: ReactNode; label: string; value: number, colorClass: string }) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <div className="flex items-center gap-5">
        <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${colorClass} shadow-sm [&>svg]:w-6 [&>svg]:h-6`}>
          {icon}
        </div>
        <div>
          <div className="text-3xl font-extrabold text-gray-900">{value}</div>
          <div className="text-sm font-medium text-gray-500 uppercase tracking-wide mt-1">{label}</div>
        </div>
      </div>
    </Card>
  );
}

const activityConfig: Record<string, { icon: ReactNode, color: string }> = {
  lesson: { icon: <Video size={16} />, color: "bg-blue-100 text-blue-600" },
  assignment: { icon: <FileText size={16} />, color: "bg-amber-100 text-amber-600" },
  enrollment: { icon: <BookOpen size={16} />, color: "bg-green-100 text-green-600" },
};

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardOut | null>(null);

  useEffect(() => {
    dashboardApi.summary().then(setData).catch(() => setData(null));
  }, []);

  if (!data) {
    return (
      <div className="mt-20 flex flex-col items-center justify-center">
        <Loader size="lg" label="Loading your dashboard…" />
      </div>
    );
  }

  const firstName = user?.full_name?.split(" ")[0] || user?.email || "Student";

  return (
    <div className="mx-auto max-w-6xl animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            Welcome back, {firstName} <Hand className="text-amber-400 w-7 h-7 inline-block animate-pulse" />
          </h1>
          <p className="mt-2 text-gray-500">Here is your learning overview for today.</p>
        </div>
        <a href="/courses">
          <Button variant="secondary">Browse Courses</Button>
        </a>
      </div>

      {/* Stat widgets */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
        <StatCard icon={<BookOpen />} label="Enrolled" value={data.enrolled_courses} colorClass="bg-brand-50 text-brand-600 border border-brand-100" />
        <StatCard icon={<Video />} label="Completed" value={data.completed_lessons} colorClass="bg-indigo-50 text-indigo-600 border border-indigo-100" />
        <StatCard icon={<FileText />} label="Pending" value={data.pending_assignments} colorClass="bg-rose-50 text-rose-600 border border-rose-100" />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-8 lg:grid-cols-2">
        {/* Upcoming assignments */}
        <Card header={<div className="flex items-center gap-2"><Clock className="w-5 h-5 text-gray-500" /> Upcoming Assignments</div>}>
          {data.pending_assignments === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <CheckCircle className="w-12 h-12 text-green-500 mb-3" />
              <h3 className="text-base font-semibold text-gray-900">All caught up!</h3>
              <p className="mt-1 text-sm text-gray-500 max-w-[250px]">You have no pending assignments due anytime soon.</p>
            </div>
          ) : (
            <div className="py-4">
              <Badge variant="warning">Action Required</Badge>
              <p className="mt-3 text-sm text-gray-600">You have {data.pending_assignments} assignments waiting for submission. Please check the assignments tab.</p>
              <a href="/assignments" className="mt-4 inline-block text-sm font-medium text-brand-600 hover:text-brand-500">
                View Assignments &rarr;
              </a>
            </div>
          )}
        </Card>

        {/* Recent activity Timeline */}
        <Card header={<div className="flex items-center gap-2"><Activity className="w-5 h-5 text-gray-500" /> Recent Activity</div>}>
          {data.recent_activity.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <Rocket className="w-12 h-12 text-brand-500 mb-3" />
              <h3 className="text-base font-semibold text-gray-900">No activity yet</h3>
              <p className="mt-1 text-sm text-gray-500 max-w-[250px]">Enroll in a course to start tracking your learning journey.</p>
            </div>
          ) : (
            <div className="relative pl-4 border-l-2 border-gray-100 py-2 space-y-6">
              {data.recent_activity.map((act, index) => {
                const config = activityConfig[act.resource] ?? { icon: <Circle size={16} />, color: "bg-gray-100 text-gray-600" };
                return (
                  <div key={`${act.resource_id ?? "activity"}-${index}`} className="relative pl-6">
                    <span className={`absolute -left-[35px] flex h-8 w-8 items-center justify-center rounded-full ring-4 ring-white ${config.color}`}>
                      {config.icon}
                    </span>
                    <div className="flex flex-col">
                      <span className="text-sm font-medium text-gray-900">
                        {act.action} <span className="capitalize">{act.resource}</span>
                      </span>
                      <span className="text-xs text-gray-400 mt-0.5">
                        {new Date(act.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
