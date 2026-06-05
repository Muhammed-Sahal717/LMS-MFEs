"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, Button, Loader, ProgressBar } from "@lms/ui";
import { learningApi, type CourseOut } from "@lms/api-client";

export default function MyLearningPage() {
  const [courses, setCourses] = useState<CourseOut[] | null>(null);

  useEffect(() => {
    learningApi.myCourses().then(setCourses).catch(() => setCourses([]));
  }, []);

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-3xl font-bold text-gray-900">My Learning</h1>
      <p className="mt-2 text-gray-600">Continue where you left off.</p>

      {courses === null ? (
        <div className="mt-10 flex justify-center">
          <Loader size="lg" label="Loading…" />
        </div>
      ) : courses.length === 0 ? (
        <p className="mt-10 text-gray-500">
          Not enrolled in any course yet.{" "}
          <a href="/courses" className="text-brand-700 hover:underline">
            Browse catalog →
          </a>
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2">
          {courses.map((c) => (
            <Card key={c.id} header={<span>{c.title}</span>}>
              <ProgressBar value={0} showLabel />
              <div className="mt-4 flex items-center justify-between text-xs text-gray-500">
                <span>{c.enrollment_count} enrolled</span>
                <Link href={`/${c.id}`}>
                  <Button size="sm">Continue</Button>
                </Link>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
