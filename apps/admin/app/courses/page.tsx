"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Button, Card, Input, Loader, Modal } from "@lms/ui";
import { adminApi, type CourseCreate, type CourseOut } from "@lms/api-client";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<CourseOut[] | null>(null);
  const [showCreate, setShowCreate] = useState(false);

  function reload() {
    adminApi.courses().then(setCourses).catch(() => setCourses([]));
  }
  useEffect(reload, []);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Manage Courses</h1>
        <Button size="sm" onClick={() => setShowCreate(true)}>+ Create course</Button>
      </div>

      {courses === null ? (
        <div className="mt-10 flex justify-center"><Loader size="lg" /></div>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {courses.map((c) => (
            <Card key={c.id}>
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-gray-900">{c.title}</div>
                  <div className="text-xs text-gray-500">
                    {c.instructor} · {c.lessonCount} lessons
                  </div>
                </div>
                <span className="text-xs text-gray-500">{c.status}</span>
              </div>
            </Card>
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

  function slugify(value: string) {
    return value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");
  }

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      const payload: CourseCreate = {
        title,
        slug: slugify(title),
        summary: description,
        description,
      };
      await adminApi.createCourse(payload);
      setTitle(""); setDescription("");
      onCreated();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Create course">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Input label="Title" required value={title} onChange={(e) => setTitle(e.target.value)} />
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Description</label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="rounded-lg border border-border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={saving}>Create</Button>
        </div>
      </form>
    </Modal>
  );
}
