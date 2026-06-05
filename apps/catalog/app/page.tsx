"use client";

import { useEffect, useMemo, useState } from "react";
import { Input, Loader } from "@lms/ui";
import { catalogApi, type Course } from "@lms/api-client";
import { CourseCard } from "./CourseCard";

export default function BrowsePage() {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    catalogApi.list().then(setCourses).catch(() => setCourses([]));
  }, []);

  const filtered = useMemo(() => {
    if (!courses) return [];
    const q = query.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter(
      (c) =>
        c.title.toLowerCase().includes(q) ||
        c.description.toLowerCase().includes(q) ||
        c.instructor.toLowerCase().includes(q),
    );
  }, [courses, query]);

  return (
    <div className="mx-auto max-w-5xl">
      <h1 className="text-3xl font-bold text-gray-900">Course Catalog</h1>
      <p className="mt-2 text-gray-600">Browse and enroll in courses.</p>

      <div className="mt-6 max-w-sm">
        <Input
          placeholder="Search courses…"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      {courses === null ? (
        <div className="mt-10 flex justify-center">
          <Loader size="lg" label="Loading courses…" />
        </div>
      ) : filtered.length === 0 ? (
        <p className="mt-10 text-gray-500">No courses match “{query}”.</p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      )}
    </div>
  );
}
