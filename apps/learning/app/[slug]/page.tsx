"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button, Loader, ProgressBar, cn } from "@lms/ui";
import { learningApi, type LessonOut } from "@lms/api-client";

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
      <div className="mt-10 flex justify-center">
        <Loader size="lg" label="Loading course…" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl">
      <Link href="/" className="text-sm text-brand-700 hover:underline">
        ← My Learning
      </Link>

      <div className="mt-4">
        <ProgressBar value={progress} showLabel />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-[1fr_300px]">
        {/* Lesson content */}
        <div>
          {active ? (
            <>
              <h1 className="text-2xl font-bold text-gray-900">{active.title}</h1>
              <div className="mt-4">
                {active.content_type === "video" ? (
                  <div className="aspect-video w-full overflow-hidden rounded-[var(--radius-card)] bg-black">
                    <iframe
                      className="h-full w-full"
                      src={active.video?.hls_url ?? active.video?.url ?? undefined}
                      title={active.title}
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <article className="rounded-[var(--radius-card)] border border-border bg-surface p-6 leading-relaxed text-gray-700">
                    {active.document?.file_url ?? "Document available."}
                  </article>
                )}
              </div>
              <div className="mt-4">
                <Button onClick={markComplete} loading={saving} disabled={completed[active.id]}>
                  {completed[active.id] ? "✓ Completed" : "Mark complete"}
                </Button>
              </div>
            </>
          ) : (
            <p className="text-gray-500">This course has no lessons yet.</p>
          )}
        </div>

        {/* Lesson list */}
        <aside className="rounded-[var(--radius-card)] border border-border bg-surface p-3">
          <h2 className="px-2 py-1 text-sm font-semibold text-gray-700">Lessons</h2>
          <ul className="mt-1 flex flex-col gap-1">
            {lessons.map((l) => (
              <li key={l.id}>
                <button
                  onClick={() => setActiveId(l.id)}
                  className={cn(
                    "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm",
                    l.id === activeId
                      ? "bg-brand-50 text-brand-700"
                      : "text-gray-600 hover:bg-surface-muted",
                  )}
                >
                  <span>{completed[l.id] ? "✓" : l.content_type === "video" ? "▶" : "📄"}</span>
                  <span className="flex-1">{l.title}</span>
                  <span className="text-xs text-gray-400">
                    {Math.round(l.duration_seconds / 60)}m
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
