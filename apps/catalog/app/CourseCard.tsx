import Link from "next/link";
import { Card, Button } from "@lms/ui";
import type { CourseOut } from "@lms/api-client";

export function CourseCard({ course }: { course: CourseOut }) {
  return (
    <Card header={<span>{course.title}</span>}>
      <p className="line-clamp-2 text-sm text-gray-600">{course.summary ?? "No summary yet."}</p>
      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <span>{course.level}</span>
        <span>{course.enrollment_count} enrolled</span>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <Link href={`/${course.id}`}>
          <Button size="sm" variant="secondary">Details</Button>
        </Link>
      </div>
    </Card>
  );
}
