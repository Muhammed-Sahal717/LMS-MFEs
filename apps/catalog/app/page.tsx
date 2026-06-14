"use client";

import { useEffect, useMemo, useState } from "react";
import { Input, Loader, EmptyState } from "@lms/ui";
import { catalogApi, type CourseOut } from "@lms/api-client";
import { CourseCard } from "./CourseCard";
import { Search, SearchX } from "lucide-react";

export default function BrowsePage() {
  const [courses, setCourses] = useState<CourseOut[] | null>(null);
  const [query, setQuery] = useState("");

  useEffect(() => {
    catalogApi.list().then(setCourses).catch(() => setCourses([]));
  }, []);

  const filtered = useMemo(() => {
    if (!courses) return [];
    const q = query.trim().toLowerCase();
    if (!q) return courses;
    return courses.filter((c) => {
      const summary = c.summary ?? "";
      return c.title.toLowerCase().includes(q) || summary.toLowerCase().includes(q);
    });
  }, [courses, query]);

  return (
    <div className="mx-auto max-w-6xl animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
        <div>
          <h1 className="text-3xl font-extrabold text-[hsl(var(--foreground))] tracking-tight">Course Catalog</h1>
          <p className="mt-2 text-lg text-[hsl(var(--muted-foreground))]">Browse, search, and enroll in our premium courses.</p>
        </div>
        <div className="w-full md:w-96 relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-[hsl(var(--muted-foreground))]">
            <Search className="w-5 h-5" />
          </div>
          <Input
            placeholder="Search for courses..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="pl-10 h-12 w-full"
          />
        </div>
      </div>

      {courses === null ? (
        <div className="mt-20 flex flex-col items-center justify-center">
          <Loader size="lg" label="Discovering courses…" />
        </div>
      ) : filtered.length === 0 ? (
        <EmptyState 
           icon={<SearchX className="w-8 h-8" />}
           title="No courses found"
           description={`We couldn't find any courses matching "${query}". Try adjusting your search.`}
           variant="dashed"
           className="mt-8"
        />
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((c) => (
            <CourseCard key={c.id} course={c} />
          ))}
        </div>
      )}
    </div>
  );
}
