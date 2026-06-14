import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from "@lms/ui";
import type { CourseOut } from "@lms/api-client";

export function CourseCard({ course }: { course: CourseOut }) {
  // Placeholder image based on course ID to ensure consistency
  const placeholderImage = `https://picsum.photos/seed/${course.id}/600/400`;
  
  const levelVariant = course.level.toLowerCase() === "beginner" ? "success" 
                     : course.level.toLowerCase() === "intermediate" ? "warning"
                     : "danger";

  return (
    <Card className="flex flex-col overflow-hidden transition-all hover:shadow-[var(--shadow-md)] hover:border-[hsl(var(--primary)/0.5)]">
      <div className="w-full aspect-video overflow-hidden bg-[hsl(var(--muted))]">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={course.thumbnail_url || placeholderImage}
          alt="Course thumbnail"
          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
        />
      </div>
      <CardHeader className="p-5 pb-3">
        <CardTitle className="truncate pr-2 text-[hsl(var(--foreground))]">{course.title}</CardTitle>
      </CardHeader>
      <CardContent className="p-5 pt-0 flex-1 flex flex-col">
        <div className="flex items-start justify-between mb-3">
          <Badge variant={levelVariant}>{course.level}</Badge>
          <span className="text-xs font-semibold text-[hsl(var(--muted-foreground))] bg-[hsl(var(--muted))] px-2 py-1 rounded-[var(--radius-sm)]">{course.enrollment_count} enrolled</span>
        </div>
        <p className="line-clamp-2 text-sm text-[hsl(var(--muted-foreground))] mb-6 min-h-[40px] flex-1">{course.summary ?? "No summary available."}</p>
        
        <Link href={`/${course.id}`} className="block w-full mt-auto">
          <Button size="sm" className="w-full justify-center">View Course Details</Button>
        </Link>
      </CardContent>
    </Card>
  );
}
