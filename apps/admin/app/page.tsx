"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, Loader, Badge } from "@lms/ui";
import { adminApi, useAuth, type ReportOut } from "@lms/api-client";
import { BookOpen, Users, BarChart3, FileText, CheckCircle2, Component, Building2, TrendingUp, Presentation } from "lucide-react";

export default function AdminOverview() {
  const { can } = useAuth();
  const [report, setReport] = useState<ReportOut | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.analytics()
      .then(setReport)
      .catch(() => setReport(null))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-7xl animate-in fade-in duration-500 pb-20">
      <div className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-[hsl(var(--foreground))] tracking-tight">Admin Control Center</h1>
          <p className="mt-2 text-[hsl(var(--muted-foreground))]">Monitor your tenant's performance and manage core configurations.</p>
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-20">
          <Loader size="lg" label="Loading analytics..." />
        </div>
      ) : report ? (
        <div className="space-y-8">
          {/* Top Level Metrics (Bento Row 1) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard 
              title="Total Users" 
              value={report.users} 
              icon={<Users className="w-5 h-5" />} 
              trend="+12% this month"
            />
            <StatCard 
              title="Active Courses" 
              value={report.courses} 
              icon={<BookOpen className="w-5 h-5" />} 
              trend="+3 new this week"
            />
            <StatCard 
              title="Total Enrollments" 
              value={report.enrollments} 
              icon={<Presentation className="w-5 h-5" />} 
              trend="High engagement"
            />
            <StatCard 
              title="Submissions" 
              value={report.submissions} 
              icon={<FileText className="w-5 h-5" />} 
              trend="Needs grading"
            />
          </div>

          {/* Quick Actions (Bento Row 2) */}
          <h2 className="text-xl font-bold tracking-tight text-[hsl(var(--foreground))] mt-10 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ActionCard
              href="/courses"
              title="Course Management"
              description="Create, edit, and publish new courses and lessons."
              icon={<BookOpen />}
            />
            <ActionCard
              href="/users"
              title="User Management"
              description="Invite new instructors, students, and manage roles."
              icon={<Users />}
            />
            <ActionCard
              href="/reports"
              title="Detailed Reports"
              description="Deep dive into platform analytics and grades."
              icon={<BarChart3 />}
            />
            {can("tenant:manage") && (
              <ActionCard
                href="/tenants"
                title="Super Admin / Tenants"
                description="Manage all tenants, licensing, and global settings."
                icon={<Building2 />}
                highlight
              />
            )}
          </div>

          {/* Licensed Modules (Bento Row 3) */}
          <Card className="mt-8 overflow-hidden border-[hsl(var(--border))] shadow-sm">
            <CardHeader className="bg-[hsl(var(--muted)/0.3)] border-b border-[hsl(var(--border))]">
              <CardTitle className="text-base flex items-center gap-2">
                <Component className="w-5 h-5 text-[hsl(var(--primary))]" /> 
                Active Modules for this Tenant
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6">
              <div className="flex flex-wrap gap-3">
                {report.active_modules.map((mod) => (
                  <Badge key={mod} variant="success" className="px-3 py-1.5 text-sm uppercase tracking-wider font-semibold">
                    <CheckCircle2 className="w-4 h-4 mr-2 inline" />
                    {mod}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-20 text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted)/0.3)] rounded-[var(--radius-xl)] border border-[hsl(var(--border))]">
          Failed to load analytics data.
        </div>
      )}
    </div>
  );
}

function StatCard({ title, value, icon, trend }: { title: string, value: number, icon: React.ReactNode, trend: string }) {
  return (
    <Card className="border-[hsl(var(--border))] shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="space-y-2">
            <p className="text-sm font-medium text-[hsl(var(--muted-foreground))] uppercase tracking-wider">{title}</p>
            <p className="text-4xl font-black text-[hsl(var(--foreground))]">{value}</p>
          </div>
          <div className="p-3 bg-[hsl(var(--primary)/0.1)] text-[hsl(var(--primary))] rounded-[var(--radius-md)]">
            {icon}
          </div>
        </div>
        <div className="mt-4 flex items-center text-xs font-medium text-[hsl(var(--success))]">
          <TrendingUp className="w-3 h-3 mr-1" />
          {trend}
        </div>
      </CardContent>
    </Card>
  );
}

function ActionCard({ href, title, description, icon, highlight = false }: { href: string, title: string, description: string, icon: React.ReactNode, highlight?: boolean }) {
  return (
    <Link href={href} className="group outline-none">
      <Card className={`h-full transition-all duration-200 group-hover:-translate-y-1 group-focus-visible:ring-2 group-focus-visible:ring-[hsl(var(--ring))] ${
        highlight 
          ? "border-[hsl(var(--primary)/0.4)] bg-[hsl(var(--primary)/0.02)] group-hover:border-[hsl(var(--primary))] group-hover:shadow-[var(--shadow-md)]" 
          : "border-[hsl(var(--border))] group-hover:border-[hsl(var(--primary)/0.5)] group-hover:shadow-[var(--shadow-md)]"
      }`}>
        <CardHeader>
          <div className="flex items-center gap-4 mb-3">
            <span className={`flex h-12 w-12 items-center justify-center rounded-[var(--radius-lg)] transition-colors ${
              highlight 
                ? "bg-[hsl(var(--primary)/0.15)] text-[hsl(var(--primary))] group-hover:bg-[hsl(var(--primary))] group-hover:text-[hsl(var(--primary-foreground))]" 
                : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] group-hover:bg-[hsl(var(--primary)/0.1)] group-hover:text-[hsl(var(--primary))]"
            }`}>
              {icon}
            </span>
            <CardTitle className="text-lg transition-colors group-hover:text-[hsl(var(--primary))]">
              {title}
            </CardTitle>
          </div>
          <p className="text-sm text-[hsl(var(--muted-foreground))]">{description}</p>
        </CardHeader>
      </Card>
    </Link>
  );
}
