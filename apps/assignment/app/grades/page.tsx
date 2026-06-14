"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, Loader, ProgressBar, EmptyState } from "@lms/ui";
import { assignmentsApi, type GradeOut } from "@lms/api-client";
import { FileText } from "lucide-react";

export default function GradesPage() {
  const [grades, setGrades] = useState<GradeOut[] | null>(null);

  useEffect(() => {
    assignmentsApi.grades().then(setGrades).catch(() => setGrades([]));
  }, []);

  return (
    <div className="mx-auto max-w-3xl animate-in fade-in duration-500">
      <Link href="/" className="text-sm text-[hsl(var(--primary))] hover:underline">← Assignments</Link>
      <h1 className="mt-4 text-3xl font-extrabold text-[hsl(var(--foreground))] tracking-tight">My Grades</h1>

      {grades === null ? (
        <div className="mt-10 flex justify-center">
          <Loader size="lg" label="Loading…" />
        </div>
      ) : grades.length === 0 ? (
        <EmptyState 
           icon={<FileText className="w-8 h-8" />}
           title="No grades yet"
           description="Your grades will appear here once assignments are evaluated."
           variant="dashed"
           className="mt-8"
        />
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {grades.map((g) => {
            const points = Number(g.points);
            const maxPoints = Number(g.max_points);
            return (
            <Card key={g.assignment_id} className="transition-all hover:shadow-[var(--shadow-md)] hover:border-[hsl(var(--primary)/0.5)]">
              <CardHeader className="pb-3 border-b border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.4)]">
                <CardTitle className="text-sm font-semibold text-[hsl(var(--card-foreground))]">Assignment {g.assignment_id.slice(0, 8)}</CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-bold text-[hsl(var(--foreground))]">
                    {Number.isFinite(points) ? points : g.points}
                    <span className="text-base font-normal text-[hsl(var(--muted-foreground))]">/{Number.isFinite(maxPoints) ? maxPoints : g.max_points}</span>
                  </span>
                  <div className="w-40">
                    <ProgressBar
                      value={Number.isFinite(points) && Number.isFinite(maxPoints) && maxPoints > 0 ? (points / maxPoints) * 100 : 0}
                      showLabel
                    />
                  </div>
                </div>
                {g.feedback ? (
                  <p className="mt-5 rounded-[var(--radius-md)] bg-[hsl(var(--muted))] p-3 text-sm text-[hsl(var(--foreground))] border border-[hsl(var(--border))]">
                    💬 <span className="italic">{g.feedback}</span>
                  </p>
                ) : null}
              </CardContent>
            </Card>
          );})}
        </div>
      )}
    </div>
  );
}
