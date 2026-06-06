import Link from "next/link";
import { Card, Button, Badge } from "@lms/ui";
import type { CourseOut } from "@lms/api-client";

export function CourseCard({ course }: { course: CourseOut }) {
  // Placeholder image based on course ID to ensure consistency
  const placeholderImage = `https://picsum.photos/seed/${course.id}/600/400`;
  
  const levelVariant = course.level.toLowerCase() === "beginner" ? "success" 
                     : course.level.toLowerCase() === "intermediate" ? "warning"
                     : "danger";

  return (
    <Card 
      header={<div className="truncate pr-2">{course.title}</div>} 
      image={course.thumbnail_url || placeholderImage}
      interactive
    >
      <div className="flex items-start justify-between mb-3">
        <Badge variant={levelVariant}>{course.level}</Badge>
        <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded-md">{course.enrollment_count} enrolled</span>
      </div>
      <p className="line-clamp-2 text-sm text-gray-600 mb-6 min-h-[40px]">{course.summary ?? "No summary available."}</p>
      
      <Link href={`/${course.id}`} className="block w-full">
        <Button size="sm" className="w-full justify-center">View Course Details</Button>
      </Link>
    </Card>
  );
}
