"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Button, Card, CardHeader, CardTitle, CardContent, Loader, Badge, Separator } from "@lms/ui";
import { catalogApi, learningApi, type CourseDetailOut } from "@lms/api-client";
import { ArrowLeft, CheckCircle2, PlayCircle, Users, BookOpen, Clock } from "lucide-react";

export default function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [course, setCourse] = useState<CourseDetailOut | null | undefined>(undefined);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);

  useEffect(() => {
    catalogApi
      .get(slug)
      .then((c) => {
        setCourse(c);
        // Silent check: if we can fetch lessons, we are enrolled
        return learningApi.lessons(c.id)
          .then(() => setEnrolled(true))
          .catch(() => setEnrolled(false)); // 403 Forbidden -> not enrolled
      })
      .catch(() => setCourse(null));
  }, [slug]);

  async function onEnroll() {
    if (!course) return;
    setEnrolling(true);
    try {
      await catalogApi.enroll(course.id);
      setEnrolled(true);
    } finally {
      setEnrolling(false);
    }
  }

  if (course === undefined) {
    return (
      <div className="mt-32 flex justify-center">
        <Loader size="lg" label="Loading course details..." />
      </div>
    );
  }

  if (course === null) {
    return (
      <div className="mx-auto max-w-4xl py-20 text-center">
        <h2 className="text-2xl font-semibold text-[hsl(var(--foreground))]">Course not found</h2>
        <p className="mt-2 text-[hsl(var(--muted-foreground))]">The course you are looking for does not exist or has been removed.</p>
        <Link href="/" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--primary))] hover:underline">
          <ArrowLeft size={16} /> Back to catalog
        </Link>
      </div>
    );
  }

  const levelVariant = course.level.toLowerCase() === "beginner" ? "success" 
                     : course.level.toLowerCase() === "intermediate" ? "warning"
                     : "danger";

  // Placeholder image based on course ID to ensure consistency
  const placeholderImage = `https://picsum.photos/seed/${course.id}/1200/400`;

  return (
    <div className="mx-auto max-w-5xl space-y-6 animate-in fade-in duration-500 pb-10">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]">
        <ArrowLeft size={16} /> Back to catalog
      </Link>
      
      {/* Hero Banner Card */}
      <div className="overflow-hidden rounded-[var(--radius-xl)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-[var(--shadow-lg)] relative">
        <div className="w-full aspect-[21/9] sm:aspect-[4/1] overflow-hidden bg-[hsl(var(--muted))] relative">
          <div className="absolute inset-0 bg-gradient-to-t from-[hsl(var(--card))] via-[hsl(var(--card)/0.4)] to-transparent z-10" />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={course.thumbnail_url || placeholderImage}
            alt="Course thumbnail"
            className="h-full w-full object-cover"
          />
        </div>
        
        <div className="relative z-20 px-6 sm:px-10 pb-8 sm:pb-10 pt-6 sm:-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="flex flex-wrap items-center gap-3">
                <Badge variant={levelVariant} className="uppercase tracking-wider text-[10px] px-2.5 py-0.5">{course.level}</Badge>
                <div className="flex items-center gap-1.5 text-sm font-medium text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))] border border-[hsl(var(--border))] px-2.5 py-1 rounded-[var(--radius-sm)] shadow-sm">
                  <Users size={14} />
                  <span>{course.enrollment_count} enrolled</span>
                </div>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-[hsl(var(--foreground))] leading-tight drop-shadow-sm">{course.title}</h1>
            </div>
            
            <div className="shrink-0 mt-4 md:mt-0">
              {enrolled ? (
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <Badge variant="success" className="px-3 py-1.5 text-sm font-medium flex gap-2 items-center rounded-full border-success-500/30">
                    <CheckCircle2 size={16} /> Enrolled
                  </Badge>
                  <a href="/learn">
                    <Button size="lg" className="w-full sm:w-auto shadow-[var(--shadow-md)]">
                      <PlayCircle className="mr-2 h-5 w-5" /> Go to Course
                    </Button>
                  </a>
                </div>
              ) : (
                <Button size="lg" onClick={onEnroll} loading={enrolling} className="w-full sm:w-auto text-base shadow-[var(--shadow-md)] px-8">
                  Enroll Now
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-4">
        {/* Left Column: Description */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="border-[hsl(var(--border))] shadow-sm overflow-hidden">
            <CardHeader className="pb-4 border-b border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.3)]">
              <CardTitle className="text-xl flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-[hsl(var(--primary))]" />
                About this course
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <div className="prose prose-sm sm:prose-base dark:prose-invert max-w-none text-[hsl(var(--foreground))] leading-relaxed opacity-90">
                {course.description ?? course.summary ?? "No detailed description provided for this course yet."}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column: Sidebar Meta */}
        <div className="space-y-6">
          <Card className="border-[hsl(var(--border))] shadow-sm bg-[hsl(var(--muted)/0.2)]">
            <CardHeader className="pb-4">
              <CardTitle className="text-lg">Course Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-5">
              <div className="flex items-start gap-3">
                <Clock className="h-5 w-5 text-[hsl(var(--muted-foreground))] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-[hsl(var(--foreground))]">Self-paced learning</h4>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">Progress at your own schedule.</p>
                </div>
              </div>
              <Separator className="bg-[hsl(var(--border))]" />
              <div className="flex items-start gap-3">
                <Users className="h-5 w-5 text-[hsl(var(--muted-foreground))] shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-sm font-semibold text-[hsl(var(--foreground))]">{course.enrollment_count} Active Students</h4>
                  <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">Join a growing community of learners.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
