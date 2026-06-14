"use client";
import { useRouter } from "next/navigation";

import { useEffect, useState, type ReactNode } from "react";
import { Loader, Badge, Button } from "@lms/ui";
import { dashboardApi, useAuth, type DashboardOut } from "@lms/api-client";
import { BookOpen, Video, FileText, Clock, CheckCircle, Activity, Rocket, Circle, Hand, GraduationCap, BookMarked, CalendarDays, ArrowRight } from "lucide-react";

function StatCard({ icon, label, value, description }: { icon: ReactNode; label: string; value: number; description?: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white text-gray-950 shadow-sm transition-all hover:shadow-md hover:border-gray-300">
      <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
        <h3 className="tracking-tight text-sm font-medium text-gray-500">{label}</h3>
        <div className="text-gray-400">
          {icon}
        </div>
      </div>
      <div className="p-6 pt-0">
        <div className="text-3xl font-bold tracking-tight">{value}</div>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}

const activityConfig: Record<string, { icon: ReactNode, color: string, bgColor: string }> = {
  lesson: { icon: <Video size={16} />, color: "text-blue-600", bgColor: "bg-blue-100" },
  assignment: { icon: <FileText size={16} />, color: "text-amber-600", bgColor: "bg-amber-100" },
  enrollment: { icon: <BookOpen size={16} />, color: "text-green-600", bgColor: "bg-green-100" },
};

function DashboardCard({ title, icon, children, footer, description }: { title: string; icon: ReactNode; children: ReactNode; footer?: ReactNode; description?: string }) {
  return (
    <div className="rounded-xl border border-gray-200 bg-white text-gray-950 shadow-sm flex flex-col h-full">
      <div className="flex flex-col space-y-1.5 p-6">
        <h3 className="font-semibold leading-none tracking-tight flex items-center gap-2 text-lg">
          {icon}
          {title}
        </h3>
        {description && <p className="text-sm text-gray-500 mt-1">{description}</p>}
      </div>
      <div className="p-6 pt-0 flex-1">
        {children}
      </div>
      {footer && (
        <div className="flex items-center p-6 pt-0">
          {footer}
        </div>
      )}
    </div>
  );
}

export default function DashboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<DashboardOut | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (user && !user.roles?.some(r => r.code === "student")) {
      const isAdmin = user.roles?.some(r => r.code === "tenant_admin" || r.code === "super_admin");
      if (isAdmin) {
        router.push("/admin");
      } else {
        router.push("/courses");
      }
      return;
    }
    dashboardApi.summary().then(setData).catch(() => setData(null));
  }, [user, router]);

  if (!data) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <Loader size="lg" label="Loading your dashboard…" />
      </div>
    );
  }

  const firstName = user?.full_name?.split(" ")[0] || user?.email || "Student";

  return (
    <div className="mx-auto max-w-6xl animate-in fade-in duration-500 pb-12">
      {/* Header section with Shadcn-like typography */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div className="space-y-1">
          <h2 className="text-3xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
            Welcome back, {firstName} <Hand className="text-amber-400 w-7 h-7 inline-block animate-pulse origin-bottom-right" />
          </h2>
          <p className="text-gray-500 text-lg">Here is an overview of your learning progress.</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/courses">
            <Button variant="secondary" className="font-medium shadow-sm border border-gray-200">
              <BookMarked className="w-4 h-4 mr-2 text-gray-500" />
              Browse Catalog
            </Button>
          </a>
        </div>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-8">
        <StatCard 
          icon={<GraduationCap className="w-5 h-5 text-brand-600" />} 
          label="Active Enrollments" 
          value={data.enrolled_courses} 
          description="Courses currently in progress"
        />
        <StatCard 
          icon={<Video className="w-5 h-5 text-indigo-600" />} 
          label="Lessons Completed" 
          value={data.completed_lessons} 
          description="Total learning modules finished"
        />
        <StatCard 
          icon={<FileText className="w-5 h-5 text-amber-600" />} 
          label="Pending Assignments" 
          value={data.pending_assignments} 
          description="Tasks requiring your attention"
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-7 lg:gap-8">
        
        {/* Left Column (Wider) */}
        <div className="md:col-span-4 space-y-6">
          <DashboardCard 
            title="Upcoming Assignments" 
            icon={<CalendarDays className="w-5 h-5 text-gray-500" />}
            description="Assignments due in the next 7 days"
          >
            {data.pending_assignments === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-100 rounded-lg bg-gray-50/50">
                <div className="h-12 w-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">All caught up!</h3>
                <p className="mt-1 text-sm text-gray-500 max-w-[250px]">You have no pending assignments due anytime soon. Keep up the great work!</p>
              </div>
            ) : (
              <div className="py-2">
                <div className="flex items-start gap-4 p-4 rounded-lg border border-amber-200 bg-amber-50">
                  <div className="mt-1">
                    <Badge variant="warning" className="px-2.5 py-0.5 text-xs font-semibold">Action Required</Badge>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-amber-900">Pending Submissions</h4>
                    <p className="mt-1 text-sm text-amber-700">You have {data.pending_assignments} assignments waiting for submission. Make sure to complete them before the deadline.</p>
                    <a href="/assignments" className="mt-3 inline-flex items-center text-sm font-semibold text-amber-700 hover:text-amber-800 transition-colors">
                      View all assignments
                      <ArrowRight className="ml-1 w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            )}
          </DashboardCard>
        </div>

        {/* Right Column */}
        <div className="md:col-span-3 space-y-6">
          <DashboardCard 
            title="Recent Activity" 
            icon={<Activity className="w-5 h-5 text-gray-500" />}
            description="Your latest actions across the platform"
          >
            {data.recent_activity.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center border-2 border-dashed border-gray-100 rounded-lg">
                <Rocket className="w-10 h-10 text-gray-300 mb-3" />
                <h3 className="text-sm font-medium text-gray-900">No activity yet</h3>
                <p className="mt-1 text-sm text-gray-500">Enroll in a course to start your journey.</p>
              </div>
            ) : (
              <div className="relative pl-2 space-y-6 before:absolute before:inset-y-0 before:left-[19px] before:w-px before:bg-gray-200">
                {data.recent_activity.map((act, index) => {
                  const config = activityConfig[act.resource] ?? { icon: <Circle size={14} />, color: "text-gray-600", bgColor: "bg-gray-100" };
                  return (
                    <div key={`${act.resource_id ?? "activity"}-${index}`} className="relative flex gap-4">
                      <div className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-4 border-white ${config.bgColor} ${config.color}`}>
                        {config.icon}
                      </div>
                      <div className="flex flex-col pt-1.5 pb-2">
                        <p className="text-sm font-medium text-gray-900 leading-none">
                          {act.action} <span className="capitalize">{act.resource}</span>
                        </p>
                        <p className="text-xs text-gray-500 mt-1.5">
                          {new Date(act.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' })}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </DashboardCard>
        </div>
        
      </div>
    </div>
  );
}
