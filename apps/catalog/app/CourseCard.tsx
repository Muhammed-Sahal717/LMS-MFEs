import Link from "next/link";
import { Card, Button } from "@lms/ui";
import type { Course } from "@lms/api-client";

export function CourseCard({ course }: { course: Course }) {
  return (
    <Card header={<span>{course.title}</span>}>
      <p className="line-clamp-2 text-sm text-gray-600">{course.description}</p>
      <div className="mt-3 flex items-center justify-between text-xs text-gray-500">
        <span>👩‍🏫 {course.instructor}</span>
        <span>{course.lessonCount} lessons</span>
      </div>
      <div className="mt-4 flex items-center gap-2">
        <Link href={`/${course.slug}`}>
          <Button size="sm" variant="secondary">Details</Button>
        </Link>
        {course.enrolled ? (
          <span className="rounded-full bg-brand-50 px-3 py-1 text-xs font-medium text-brand-700">
            Enrolled
          </span>
        ) : null}
      </div>
    </Card>
  );
}
