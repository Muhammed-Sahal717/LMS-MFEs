"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { Button, Card, CardHeader, CardTitle, CardDescription, Input, Loader, Modal, EmptyState, Badge } from "@lms/ui";
import { adminApi, type CourseCreate, type CourseOut } from "@lms/api-client";
import { BookOpen } from "lucide-react";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<CourseOut[] | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  function reload() {
    adminApi.courses().then(setCourses).catch(() => setCourses([]));
  }
  useEffect(reload, []);

  return (
    <div className="animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-[hsl(var(--foreground))] tracking-tight">Manage Courses</h1>
          <p className="mt-2 text-[hsl(var(--muted-foreground))]">Create and manage your educational content.</p>
        </div>
        <Button size="sm" onClick={() => setShowCreate(true)} className="w-full sm:w-auto">+ Create course</Button>
      </div>

      {courses === null ? (
        <div className="mt-10 flex justify-center"><Loader size="lg" /></div>
      ) : courses.length === 0 ? (
        <EmptyState 
           icon={<BookOpen className="w-8 h-8" />}
           title="No courses yet"
           description="Get started by creating your first course."
           variant="dashed"
           className="mt-8"
        />
      ) : (
        <div className="mt-6 flex flex-col gap-4">
          {courses.map((c) => (
            <Link key={c.id} href={`/courses/${c.id}`} className="group">
              <Card className="transition-colors group-hover:border-[hsl(var(--primary)/0.5)] group-hover:shadow-[var(--shadow-md)]">
                <CardHeader className="flex flex-row items-center justify-between p-5">
                  <div className="space-y-1">
                    <CardTitle className="text-base group-hover:text-[hsl(var(--primary))] transition-colors">{c.title}</CardTitle>
                    <CardDescription className="text-xs">
                      {c.enrollment_count} enrollments &middot; {new Date(c.created_at).toLocaleDateString()}
                    </CardDescription>
                  </div>
                  <Badge variant={c.status === "published" ? "success" : "secondary"} className="uppercase tracking-wider">
                    {c.status}
                  </Badge>
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}

      <CreateCourseModal
        open={showCreate}
        onClose={() => setShowCreate(false)}
        onCreated={() => { setShowCreate(false); reload(); }}
      />
    </div>
  );
}

function CreateCourseModal({
  open,
  onClose,
  onCreated,
}: {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function slugify(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSaving(true);
    try {
      const payload: CourseCreate = {
        title,
        slug: slugify(title),
        summary: description,
        description,
        level: "beginner",
        is_free: true,
        price: "0",
      };
      await adminApi.createCourse(payload);
      setTitle(""); setDescription("");
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create course.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Create course">
      <form onSubmit={submit} className="flex flex-col gap-4">
        {error ? <p className="text-sm text-[hsl(var(--destructive))]">{error}</p> : null}
        <Input label="Title" required value={title} onChange={(e) => setTitle(e.target.value)} />
        <div className="flex flex-col gap-1.5 w-full">
          <label className="text-sm font-medium leading-none text-[hsl(var(--foreground))]">Description</label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="flex w-full rounded-[var(--radius-md)] border border-[hsl(var(--input))] bg-transparent px-3 py-2 text-sm shadow-sm transition-colors placeholder:text-[hsl(var(--muted-foreground))] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-[hsl(var(--ring))] disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={saving}>Create</Button>
        </div>
      </form>
    </Modal>
  );
}
