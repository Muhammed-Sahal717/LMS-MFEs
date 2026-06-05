"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Button, Card, Loader } from "@lms/ui";
import { catalogApi, type CourseDetailOut } from "@lms/api-client";

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
      .then(setCourse)
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
      <div className="mt-10 flex justify-center">
        <Loader size="lg" label="Loading…" />
      </div>
    );
  }

  if (course === null) {
    return (
      <div className="mx-auto max-w-3xl">
        <p className="text-gray-600">Course not found.</p>
        <Link href="/" className="mt-4 inline-block text-brand-700 hover:underline">
          ← Back to catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/" className="text-sm text-brand-700 hover:underline">
        ← Back to catalog
      </Link>
      <h1 className="mt-4 text-3xl font-bold text-gray-900">{course.title}</h1>
      <div className="mt-2 flex gap-4 text-sm text-gray-500">
        <span>{course.level}</span>
        <span>{course.enrollment_count} enrolled</span>
      </div>

      <Card className="mt-6">
        <p className="text-gray-700">{course.description ?? course.summary ?? "No description yet."}</p>
        <div className="mt-6">
          {enrolled ? (
            <div className="flex items-center gap-3">
              <span className="rounded-full bg-brand-50 px-3 py-1 text-sm font-medium text-brand-700">
                ✓ Enrolled
              </span>
              {/* Cross-zone → learning MFE (full reload). */}
              <a href="/learn">
                <Button size="sm">Go to course</Button>
              </a>
            </div>
          ) : (
            <Button onClick={onEnroll} loading={enrolling}>
              Enroll now
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}
