"use client";
import { useRouter } from "next/navigation";

import { useEffect, useState, type ReactNode } from "react";
import { Loader, Badge, Button, Card, CardHeader, CardTitle, CardContent, EmptyState } from "@lms/ui";
import { dashboardApi, useAuth, type DashboardOut } from "@lms/api-client";
import { BookOpen, Video, FileText, CheckCircle, Activity, Rocket, Circle, Hand, GraduationCap, BookMarked, CalendarDays, ArrowRight } from "lucide-react";

function StatCard({ icon, label, value, description }: { icon: ReactNode; label: string; value: number; description?: string }) {
  return (
    <Card className="transition-all hover:shadow-[var(--shadow-md)] hover:border-[hsl(var(--primary)/0.5)]">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-[hsl(var(--muted-foreground))]">{label}</CardTitle>
        <div className="text-[hsl(var(--muted-foreground))]">
          {icon}
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold tracking-tight text-[hsl(var(--card-foreground))]">{value}</div>
        {description && (
          <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1">{description}</p>
        )}
      </CardContent>
    </Card>
  );
}

const activityConfig: Record<string, { icon: ReactNode, color: string, bgColor: string }> = {
  lesson: { icon: <Video size={16} />, color: "text-[hsl(var(--primary))]", bgColor: "bg-[hsl(var(--primary)/0.15)]" },
  assignment: { icon: <FileText size={16} />, color: "text-amber-600 dark:text-amber-400", bgColor: "bg-amber-100 dark:bg-amber-900/30" },
  enrollment: { icon: <BookOpen size={16} />, color: "text-emerald-600 dark:text-emerald-400", bgColor: "bg-emerald-100 dark:bg-emerald-900/30" },
};

function DashboardCard({ title, icon, children, description }: { title: string; icon: ReactNode; children: ReactNode; description?: string }) {
  return (
    <Card className="flex flex-col h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          {icon}
          {title}
        </CardTitle>
        {description && <p className="text-sm text-[hsl(var(--muted-foreground))]">{description}</p>}
      </CardHeader>
      <CardContent className="flex-1">
        {children}
      </CardContent>
    </Card>
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
          <h2 className="text-3xl font-bold tracking-tight text-[hsl(var(--foreground))] flex items-center gap-2">
            Welcome back, {firstName} <Hand className="text-amber-400 w-7 h-7 inline-block animate-pulse origin-bottom-right" />
          </h2>
          <p className="text-[hsl(var(--muted-foreground))] text-lg">Here is an overview of your learning progress.</p>
        </div>
        <div className="flex items-center gap-3">
          <a href="/courses">
            <Button variant="secondary" className="font-medium shadow-[var(--shadow-sm)] border border-[hsl(var(--border))]">
              <BookMarked className="w-4 h-4 mr-2 text-[hsl(var(--muted-foreground))]" />
              Browse Catalog
            </Button>
          </a>
        </div>
      </div>

      {/* Bento Grid Stats */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3 mb-8">
        <StatCard 
          icon={<GraduationCap className="w-5 h-5 text-[hsl(var(--primary))]" />} 
          label="Active Enrollments" 
          value={data.enrolled_courses} 
          description="Courses currently in progress"
        />
        <StatCard 
          icon={<Video className="w-5 h-5 text-indigo-500" />} 
          label="Lessons Completed" 
          value={data.completed_lessons} 
          description="Total learning modules finished"
        />
        <StatCard 
          icon={<FileText className="w-5 h-5 text-amber-500" />} 
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
            icon={<CalendarDays className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />}
            description="Assignments due in the next 7 days"
          >
            {data.pending_assignments === 0 ? (
              <EmptyState 
                 icon={<CheckCircle className="w-8 h-8 text-emerald-600" />}
                 title="All caught up!"
                 description="You have no pending assignments due anytime soon. Keep up the great work!"
                 variant="dashed"
              />
            ) : (
              <div className="py-2">
                <div className="flex items-start gap-4 p-4 rounded-[var(--radius-md)] border border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950">
                  <div className="mt-1">
                    <Badge variant="warning" className="px-2.5 py-0.5 text-xs font-semibold">Action Required</Badge>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-amber-900 dark:text-amber-100">Pending Submissions</h4>
                    <p className="mt-1 text-sm text-amber-700 dark:text-amber-300">You have {data.pending_assignments} assignments waiting for submission. Make sure to complete them before the deadline.</p>
                    <a href="/assignments" className="mt-3 inline-flex items-center text-sm font-semibold text-amber-700 dark:text-amber-300 hover:text-amber-800 dark:hover:text-amber-200 transition-colors">
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
            icon={<Activity className="w-5 h-5 text-[hsl(var(--muted-foreground))]" />}
            description="Your latest actions across the platform"
          >
            {data.recent_activity.length === 0 ? (
              <EmptyState 
                 icon={<Rocket className="w-8 h-8" />}
                 title="No activity yet"
                 description="Enroll in a course to start your journey."
                 variant="dashed"
              />
            ) : (
              <div className="relative pl-2 space-y-6 before:absolute before:inset-y-0 before:left-[19px] before:w-px before:bg-[hsl(var(--border))]">
                {data.recent_activity.map((act, index) => {
                  const config = activityConfig[act.resource] ?? { icon: <Circle size={14} />, color: "text-[hsl(var(--muted-foreground))]", bgColor: "bg-[hsl(var(--muted))]" };
                  return (
                    <div key={`${act.resource_id ?? "activity"}-${index}`} className="relative flex gap-4">
                      <div className={`relative z-10 flex h-8 w-8 shrink-0 items-center justify-center rounded-full border-4 border-[hsl(var(--card))] ${config.bgColor} ${config.color}`}>
                        {config.icon}
                      </div>
                      <div className="flex flex-col pt-1.5 pb-2">
                        <p className="text-sm font-medium text-[hsl(var(--foreground))] leading-none">
                          {act.action} <span className="capitalize">{act.resource}</span>
                        </p>
                        <p className="text-xs text-[hsl(var(--muted-foreground))] mt-1.5">
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
