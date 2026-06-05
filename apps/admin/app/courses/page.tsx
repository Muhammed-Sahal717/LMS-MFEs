"use client";

import { useEffect, useState, type FormEvent } from "react";
import { Button, Card, Input, Loader, Modal } from "@lms/ui";
import {
  adminApi,
  type Course,
  type CreateLessonPayload,
  type Lesson,
} from "@lms/api-client";

export default function AdminCoursesPage() {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [manage, setManage] = useState<Course | null>(null);

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
                <Button size="sm" variant="secondary" onClick={() => setManage(c)}>
                  Manage lessons
                </Button>
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
      <ManageLessonsModal
        course={manage}
        onClose={() => setManage(null)}
        onChanged={reload}
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
  const [instructor, setInstructor] = useState("");
  const [saving, setSaving] = useState(false);

  async function submit(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await adminApi.createCourse({ title, description, instructor });
      setTitle(""); setDescription(""); setInstructor("");
      onCreated();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Create course">
      <form onSubmit={submit} className="flex flex-col gap-4">
        <Input label="Title" required value={title} onChange={(e) => setTitle(e.target.value)} />
        <Input label="Instructor" required value={instructor} onChange={(e) => setInstructor(e.target.value)} />
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

function ManageLessonsModal({
  course,
  onClose,
  onChanged,
}: {
  course: Course | null;
  onClose: () => void;
  onChanged: () => void;
}) {
  const [lessons, setLessons] = useState<Lesson[] | null>(null);
  const [draft, setDraft] = useState<CreateLessonPayload>({
    title: "",
    type: "video",
    durationMinutes: 10,
  });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!course) { setLessons(null); return; }
    adminApi.lessons(course.slug).then(setLessons).catch(() => setLessons([]));
  }, [course]);

  async function addLesson(e: FormEvent) {
    e.preventDefault();
    if (!course) return;
    setSaving(true);
    try {
      const created = await adminApi.addLesson(course.id, draft);
      setLessons((prev) => (prev ? [...prev, created] : [created]));
      setDraft({ title: "", type: "video", durationMinutes: 10 });
      onChanged();
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={!!course} onClose={onClose} title={course ? `Lessons — ${course.title}` : ""}>
      {lessons === null ? (
        <Loader />
      ) : (
        <>
          <ul className="flex flex-col gap-2">
            {lessons.length === 0 ? (
              <li className="text-sm text-gray-500">No lessons yet.</li>
            ) : (
              lessons.map((l) => (
                <li key={l.id} className="flex items-center justify-between rounded-lg bg-surface-muted px-3 py-2 text-sm">
                  <span>{l.type === "video" ? "▶" : "📄"} {l.title}</span>
                  <span className="text-xs text-gray-400">{l.durationMinutes}m</span>
                </li>
              ))
            )}
          </ul>

          <form onSubmit={addLesson} className="mt-4 flex flex-col gap-3 border-t border-border pt-4">
            <Input
              label="New lesson title"
              required
              value={draft.title}
              onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
            />
            <div className="flex gap-3">
              <select
                value={draft.type}
                onChange={(e) => setDraft((d) => ({ ...d, type: e.target.value as "video" | "reading" }))}
                className="h-10 rounded-lg border border-border px-3 text-sm"
              >
                <option value="video">Video</option>
                <option value="reading">Reading</option>
              </select>
              <Input
                type="number"
                min={1}
                value={draft.durationMinutes}
                onChange={(e) => setDraft((d) => ({ ...d, durationMinutes: Number(e.target.value) }))}
              />
              <Button type="submit" loading={saving}>Add</Button>
            </div>
          </form>
        </>
      )}
    </Modal>
  );
}
