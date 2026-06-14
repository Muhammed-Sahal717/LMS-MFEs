"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, Button, Loader, ProgressBar, EmptyState } from "@lms/ui";
import { learningApi, type CourseOut } from "@lms/api-client";
import { GraduationCap } from "lucide-react";

export default function MyLearningPage() {
  const [courses, setCourses] = useState<CourseOut[] | null>(null);

  useEffect(() => {
    learningApi.myCourses().then(setCourses).catch(() => setCourses([]));
  }, []);

  return (
    <div className="mx-auto max-w-5xl animate-in fade-in duration-500">
      <h1 className="text-3xl font-extrabold text-[hsl(var(--foreground))] tracking-tight">My Learning</h1>
      <p className="mt-2 text-[hsl(var(--muted-foreground))]">Continue where you left off.</p>

      {courses === null ? (
        <div className="mt-10 flex justify-center">
          <Loader size="lg" label="Loading…" />
        </div>
      ) : courses.length === 0 ? (
        <EmptyState 
           icon={<GraduationCap className="w-8 h-8" />}
           title="Not enrolled in any course yet."
           description="Explore our catalog and find the perfect course for you."
           action={<Link href="/courses"><Button>Browse Catalog</Button></Link>}
           variant="dashed"
           className="mt-8"
        />
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2">
          {courses.map((c) => (
            <Card key={c.id} className="transition-all hover:shadow-[var(--shadow-md)] hover:border-[hsl(var(--primary)/0.5)]">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg text-[hsl(var(--foreground))] group-hover:text-[hsl(var(--primary))] transition-colors">{c.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <ProgressBar value={0} showLabel />
                <div className="mt-6 flex items-center justify-between text-xs text-[hsl(var(--muted-foreground))]">
                  <span className="bg-[hsl(var(--muted))] px-2 py-1 rounded-[var(--radius-sm)] font-medium text-[hsl(var(--foreground))]">{c.enrollment_count} enrolled</span>
                  <Link href={`/${c.id}`}>
                    <Button size="sm">Continue</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
