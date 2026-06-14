"use client";

import { use, useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button, Card, Input, Loader } from "@lms/ui";
import { adminApi, type CourseOut, type CourseUpdate } from "@lms/api-client";
import { ArrowLeft, Save, AlertCircle } from "lucide-react";

export default function CourseEditorPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter();
  const { id } = use(params);
  
  const [course, setCourse] = useState<CourseOut | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<"general" | "curriculum">("general");

  // Form State
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [level, setLevel] = useState<CourseOut["level"]>("beginner");
  const [status, setStatus] = useState<CourseOut["status"]>("draft");

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
        <Card>
          <div className="p-8 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 bg-brand-50 text-brand-600 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Lesson Management Unavailable</h3>
            <p className="mt-2 text-gray-500 max-w-md mx-auto">
              The backend team has not yet deployed the administrative endpoints for uploading and managing lessons. Once the <code className="text-xs bg-gray-100 px-1 py-0.5 rounded text-pink-600">POST /admin/courses/{"{id}"}/lessons</code> endpoint is available, you will be able to build out your curriculum here.
            </p>
            <Button disabled className="mt-6" variant="secondary">
              + Add Lesson (Coming Soon)
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
