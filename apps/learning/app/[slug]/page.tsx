"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button, Loader, ProgressBar, cn } from "@lms/ui";
import { learningApi, type LessonOut } from "@lms/api-client";
import { ArrowLeft, Check, FileText, PackageOpen, Video } from "lucide-react";

export default function PlayerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [lessons, setLessons] = useState<LessonOut[] | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [completed, setCompleted] = useState<Record<string, boolean>>({});

  useEffect(() => {
    Promise.all([
      learningApi.lessons(slug),
      learningApi.progress().catch(() => []) // fallback if no progress tracking
    ])
      .then(([ls, prog]) => {
        setLessons(ls);
        setActiveId(ls[0]?.id ?? null);
        
        // Populate the completed state using historical progress data
        const initialCompleted: Record<string, boolean> = {};
        prog.forEach((p) => {
          if (p.status === "completed") {
            initialCompleted[p.lesson_id] = true;
          }
        });
        setCompleted(initialCompleted);
      })
      .catch(() => setLessons([]));
  }, [slug]);

  const active = useMemo(
    () => lessons?.find((l) => l.id === activeId) ?? null,
    [lessons, activeId],
  );

  const progress = useMemo(() => {
    if (!lessons || lessons.length === 0) return 0;
    const done = lessons.filter((l) => completed[l.id]).length;
    return Math.round((done / lessons.length) * 100);
  }, [lessons, completed]);

  async function markComplete() {
    if (!active || completed[active.id]) return;
    setSaving(true);
    try {
      await learningApi.markComplete(active.id);
      setCompleted((prev) => ({ ...prev, [active.id]: true }));
    } finally {
      setSaving(false);
    }
  }

  if (lessons === null) {
    return (
      <div className="mt-20 flex justify-center">
        <Loader size="lg" label="Loading course…" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] animate-in fade-in duration-500">
      <div className="flex items-center justify-between mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-brand-600 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="w-64">
          <ProgressBar value={progress} showLabel />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_350px]">
        {/* Main Content Area */}
        <div className="flex flex-col">
          {active ? (
            <div className="flex flex-col flex-1">
              <div className="mb-4">
                <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{active.title}</h1>
              </div>
              
              <div className="relative w-full rounded-2xl overflow-hidden bg-gray-900 shadow-2xl ring-1 ring-gray-900/10 mb-6">
                {active.content_type === "video" ? (
                  <div className="aspect-video w-full">
                    <iframe
                      className="h-full w-full"
                      src={active.video?.hls_url ?? active.video?.url ?? undefined}
                      title={active.title}
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <article className="min-h-[500px] bg-white p-10 prose prose-brand max-w-none">
                    {active.document?.file_url ?? (
                      <div className="flex flex-col items-center justify-center h-full text-center text-gray-500">
                        <FileText className="w-12 h-12 mb-4 text-gray-400" />
                        <p>Document content goes here.</p>
                      </div>
                    )}
                  </article>
                )}
              </div>

              <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-gray-100 shadow-sm">
                <div>
                  <h3 className="font-semibold text-gray-900">Mark as Done</h3>
                  <p className="text-sm text-gray-500">Complete this lesson to advance your progress.</p>
                </div>
                <Button 
                  onClick={markComplete} 
                  loading={saving} 
                  disabled={completed[active.id]}
                  size="lg"
                  className={cn(completed[active.id] && "bg-green-600 hover:bg-green-700")}
                >
                  {completed[active.id] ? "✓ Completed" : "Mark complete"}
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-96 bg-gray-50 rounded-2xl border border-dashed border-gray-300 text-center">
              <PackageOpen className="w-12 h-12 text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900">No Lessons Found</h3>
              <p className="mt-1 text-gray-500">This course doesn't have any lessons uploaded yet.</p>
            </div>
          )}
        </div>

        {/* Course Curriculum Sidebar */}
        <aside className="flex flex-col h-[800px] overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
          <div className="px-6 py-5 border-b border-gray-100 bg-gray-50/50">
            <h2 className="text-lg font-bold text-gray-900">Course Curriculum</h2>
            <p className="text-sm text-gray-500 mt-1">{lessons.length} total lessons</p>
          </div>
          
          <ul className="flex-1 overflow-y-auto p-3 space-y-1">
            {lessons.map((l, index) => {
              const isActive = l.id === activeId;
              const isDone = completed[l.id];
              return (
                <li key={l.id}>
                  <button
                    onClick={() => setActiveId(l.id)}
                    className={cn(
                      "group flex w-full items-start gap-4 rounded-xl px-4 py-3 text-left transition-all",
                      isActive
                        ? "bg-brand-50 shadow-sm ring-1 ring-brand-200"
                        : "hover:bg-gray-50",
                    )}
                  >
                    <div className={cn(
                      "flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm mt-0.5",
                      isDone ? "bg-green-100 text-green-600" : 
                      isActive ? "bg-brand-600 text-white" : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                    )}>
                      {isDone ? <Check className="w-4 h-4" /> : (index + 1)}
                    </div>
                    
                    <div className="flex flex-1 flex-col">
                      <span className={cn(
                        "text-sm font-medium leading-tight",
                        isActive ? "text-brand-900" : "text-gray-700 group-hover:text-gray-900"
                      )}>
                        {l.title}
                      </span>
                      <div className="flex items-center gap-2 mt-1.5 text-xs text-gray-500">
                        <span className="flex items-center gap-1 text-gray-400">
                          {l.content_type === "video" ? <Video className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />} 
                          <span className="capitalize">{l.content_type}</span>
                        </span>
                        <span>•</span>
                        <span>{Math.round(l.duration_seconds / 60)} min</span>
                      </div>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        </aside>
      </div>
    </div>
  );
}
