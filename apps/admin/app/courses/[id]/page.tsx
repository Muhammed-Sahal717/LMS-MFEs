"use client";

import { use, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card, Input, Loader, Modal, Badge } from "@lms/ui";
import { adminApi, type CourseOut, type CourseUpdate, type LessonOut, type AssignmentOut } from "@lms/api-client";
import { ArrowLeft, Save, AlertCircle, Video, FileText, File, ClipboardList } from "lucide-react";

export default function CourseEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [course, setCourse] = useState<CourseOut | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "curriculum" | "assignments">("general");

  const [lessons, setLessons] = useState<LessonOut[]>([]);
  const [showAddLesson, setShowAddLesson] = useState(false);
  const [loadingLessons, setLoadingLessons] = useState(false);

  const [assignments, setAssignments] = useState<AssignmentOut[]>([]);
  const [showAddAssignment, setShowAddAssignment] = useState(false);
  const [loadingAssignments, setLoadingAssignments] = useState(false);

  // Form State
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [level, setLevel] = useState<CourseOut["level"]>("beginner");
  const [status, setStatus] = useState<CourseOut["status"]>("draft");

  function loadLessons() {
    setLoadingLessons(true);
    adminApi.getCourseLessons(id)
      .then(setLessons)
      .catch(console.error)
      .finally(() => setLoadingLessons(false));
  }

  function loadAssignments() {
    setLoadingAssignments(true);
    adminApi.getCourseAssignments(id)
      .then(setAssignments)
      .catch(console.error)
      .finally(() => setLoadingAssignments(false));
  }

  useEffect(() => {
    adminApi.getCourse(id)
      .then((c) => {
        setCourse(c);
        setDescription(c.summary ?? "");
        setPrice(c.price);
        setLevel(c.level);
        setStatus(c.status);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
      
    loadLessons();
    loadAssignments();
  }, [id]);

  async function handleSave(e: FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload: CourseUpdate = {
        description,
        summary: description, // keeping them in sync for now
        price: price || "0",
        is_free: !price || parseFloat(price) === 0,
        level,
        status,
      };
      const updated = await adminApi.updateCourse(id, payload);
      setCourse(updated);
      setStatus(updated.status); // backend might enforce rules
      // Optional: show toast success
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update course.");
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return <div className="mt-20 flex justify-center"><Loader size="lg" /></div>;
  }

  if (!course) {
    return (
      <div className="mt-10">
        <Link href="/courses" className="text-brand-600 hover:underline flex items-center gap-2 mb-4">
          <ArrowLeft size={16} /> Back to courses
        </Link>
        <div className="text-red-500 font-medium text-lg">Course not found. {error}</div>
      </div>
    );
  }

  return (
    <div className="animate-in fade-in duration-500 max-w-4xl mx-auto">
      <Link href="/courses" className="text-gray-500 hover:text-gray-900 flex items-center gap-2 mb-6 transition-colors text-sm font-medium">
        <ArrowLeft size={16} /> Back to Courses
      </Link>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{course.title}</h1>
          <p className="mt-1 text-gray-500">Manage course settings and curriculum.</p>
        </div>
        <div className="flex items-center gap-3">
          <span className={`px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase ${
            status === "published" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
          }`}>
            {status}
          </span>
          <Button onClick={handleSave} loading={saving} className="flex items-center gap-2">
            <Save size={16} /> Save Changes
          </Button>
        </div>
      </div>

      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab("general")}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "general"
                ? "border-brand-500 text-brand-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            General Settings
          </button>
          <button
            onClick={() => setActiveTab("curriculum")}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "curriculum"
                ? "border-brand-500 text-brand-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Curriculum
          </button>
          <button
            onClick={() => setActiveTab("assignments")}
            className={`whitespace-nowrap pb-4 px-1 border-b-2 font-medium text-sm transition-colors ${
              activeTab === "assignments"
                ? "border-brand-500 text-brand-600"
                : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
            }`}
          >
            Assignments
          </button>
        </nav>
      </div>

      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-600 rounded-lg p-4 text-sm flex items-start gap-3">
          <AlertCircle size={18} className="mt-0.5 shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {activeTab === "general" && (
        <form onSubmit={handleSave} className="space-y-6">
          <Card>
            <div className="space-y-6 p-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-medium text-gray-700">Course Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="What will students learn in this course?"
                  className="rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Difficulty Level</label>
                  <select
                    value={level}
                    onChange={(e) => setLevel(e.target.value as any)}
                    className="h-10 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
                  >
                    <option value="beginner">Beginner</option>
                    <option value="intermediate">Intermediate</option>
                    <option value="advanced">Advanced</option>
                  </select>
                </div>
                
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-medium text-gray-700">Price (USD)</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="h-10 w-full rounded-lg border border-gray-300 pl-7 pr-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-medium text-gray-900">Publish Status</h3>
                  <p className="text-xs text-gray-500 mt-1">Draft courses are hidden from the catalog.</p>
                </div>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="h-10 rounded-lg border border-gray-300 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white font-medium"
                >
                  <option value="draft">Draft (Hidden)</option>
                  <option value="published">Published (Public)</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
          </Card>
        </form>
      )}

      {activeTab === "curriculum" && (
        <Card className="p-0 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Course Curriculum</h3>
              <p className="text-sm text-gray-500 mt-1">Manage the lessons and modules for this course.</p>
            </div>
            <Button onClick={() => setShowAddLesson(true)} className="flex items-center gap-2">
              <FileText size={16} /> Add Lesson
            </Button>
          </div>
          
          <div className="p-0">
            {loadingLessons ? (
              <div className="p-12 flex justify-center"><Loader /></div>
            ) : lessons.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-4">
                  <FileText className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">No lessons yet</h3>
                <p className="mt-2 text-gray-500 max-w-sm mx-auto">
                  Get started by adding your first text lesson to build out this course curriculum.
                </p>
                <Button variant="secondary" className="mt-6" onClick={() => setShowAddLesson(true)}>
                  Add First Lesson
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50/80">
                    <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wider text-gray-500 font-semibold">
                      <th className="px-6 py-4">Title</th>
                      <th className="px-6 py-4">Type</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {lessons.map((lesson) => (
                      <tr key={lesson.id} className="hover:bg-gray-50/80 transition-colors group">
                        <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                          {lesson.content_type === "video" ? <Video className="text-brand-500 w-5 h-5" /> : 
                           lesson.content_type === "document" ? <File className="text-orange-500 w-5 h-5" /> :
                           <FileText className="text-blue-500 w-5 h-5" />}
                          {lesson.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500 capitalize">
                          {lesson.content_type}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {lesson.is_preview ? <Badge variant="warning">Preview</Badge> : <Badge variant="success">Published</Badge>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>
      )}

      <AddLessonModal
        courseId={id}
        open={showAddLesson}
        onClose={() => setShowAddLesson(false)}
        onCreated={() => {
          setShowAddLesson(false);
          loadLessons();
        }}
      />

      {activeTab === "assignments" && (
        <Card className="p-0 overflow-hidden">
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
              <h3 className="text-lg font-bold text-gray-900">Course Assignments</h3>
              <p className="text-sm text-gray-500 mt-1">Manage homework and project assignments for this course.</p>
            </div>
            <Button onClick={() => setShowAddAssignment(true)} className="flex items-center gap-2">
              <ClipboardList size={16} /> Add Assignment
            </Button>
          </div>
          
          <div className="p-0">
            {loadingAssignments ? (
              <div className="p-12 flex justify-center"><Loader /></div>
            ) : assignments.length === 0 ? (
              <div className="p-12 text-center flex flex-col items-center justify-center">
                <div className="w-16 h-16 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mb-4">
                  <ClipboardList className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900">No assignments yet</h3>
                <p className="mt-2 text-gray-500 max-w-sm mx-auto">
                  Create your first assignment to give students tasks to complete.
                </p>
                <Button variant="secondary" className="mt-6" onClick={() => setShowAddAssignment(true)}>
                  Create First Assignment
                </Button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50/80">
                    <tr className="border-b border-gray-200 text-left text-xs uppercase tracking-wider text-gray-500 font-semibold">
                      <th className="px-6 py-4">Title</th>
                      <th className="px-6 py-4">Max Points</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {assignments.map((assignment) => (
                      <tr key={assignment.id} className="hover:bg-gray-50/80 transition-colors group">
                        <td className="px-6 py-4 font-medium text-gray-900 flex items-center gap-3">
                          <ClipboardList className="text-brand-500 w-5 h-5" />
                          {assignment.title}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                          {assignment.max_points}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {assignment.is_published ? <Badge variant="success">Published</Badge> : <Badge variant="warning">Draft</Badge>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </Card>
      )}

      <AddAssignmentModal
        courseId={id}
        open={showAddAssignment}
        onClose={() => setShowAddAssignment(false)}
        onCreated={() => {
          setShowAddAssignment(false);
          loadAssignments();
        }}
      />
    </div>
  );
}

function AddLessonModal({
  courseId,
  open,
  onClose,
  onCreated,
}: {
  courseId: string;
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await adminApi.createLesson(courseId, {
        title,
        content_type: "text" as any,
        content,
        is_preview: false,
        order_index: 0, // Should calculate dynamically but ok for MVP
      });
      setTitle("");
      setContent("");
      onCreated();
    } catch (err: any) {
      setError(err.message || "Failed to create lesson.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Add New Lesson">
      <form onSubmit={submit} className="flex flex-col gap-4">
        {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}
        
        <Input label="Lesson Title" required value={title} onChange={(e) => setTitle(e.target.value)} />
        
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Lesson Content (Text)</label>
          <textarea
            required
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={8}
            placeholder="Write your lesson content here..."
            className="rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={saving}>Create Lesson</Button>
        </div>
      </form>
    </Modal>
  );
}

function AddAssignmentModal({
  courseId,
  open,
  onClose,
  onCreated,
}: {
  courseId: string;
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [maxPoints, setMaxPoints] = useState("100");
  const [passPoints, setPassPoints] = useState("50");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await adminApi.createAssignment(courseId, {
        title,
        description,
        max_points: parseFloat(maxPoints),
        pass_points: parseFloat(passPoints),
        is_published: true, // Auto-publish for MVP
      });
      setTitle("");
      setDescription("");
      setMaxPoints("100");
      setPassPoints("50");
      onCreated();
    } catch (err: any) {
      setError(err.message || "Failed to create assignment.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <Modal open={open} onClose={onClose} title="Add New Assignment">
      <form onSubmit={submit} className="flex flex-col gap-4">
        {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">{error}</p>}
        
        <Input label="Assignment Title" required value={title} onChange={(e) => setTitle(e.target.value)} />
        
        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-gray-700">Instructions / Description</label>
          <textarea
            required
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={5}
            placeholder="Describe what the student needs to do..."
            className="rounded-lg border border-gray-300 p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input 
            label="Max Points" 
            type="number" 
            required 
            value={maxPoints} 
            onChange={(e) => setMaxPoints(e.target.value)} 
          />
          <Input 
            label="Passing Points" 
            type="number" 
            required 
            value={passPoints} 
            onChange={(e) => setPassPoints(e.target.value)} 
          />
        </div>

        <div className="flex justify-end gap-2 mt-4">
          <Button type="button" variant="ghost" onClick={onClose}>Cancel</Button>
          <Button type="submit" loading={saving}>Create Assignment</Button>
        </div>
      </form>
    </Modal>
  );
}
