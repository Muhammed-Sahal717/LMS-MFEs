"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button, Loader, ProgressBar, cn } from "@lms/ui";
import { learningApi, type Lesson } from "@lms/api-client";

export default function PlayerPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const [lessons, setLessons] = useState<Lesson[] | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    learningApi
      .lessons(slug)
      .then((ls) => {
        setLessons(ls);
        setActiveId(ls[0]?.id ?? null);
      })
      .catch(() => setLessons([]));
  }, [slug]);

  const active = useMemo(
    () => lessons?.find((l) => l.id === activeId) ?? null,
    [lessons, activeId],
  );

  const progress = useMemo(() => {
    if (!lessons || lessons.length === 0) return 0;
    return Math.round((lessons.filter((l) => l.completed).length / lessons.length) * 100);
  }, [lessons]);

  async function markComplete() {
    if (!active || active.completed) return;
    setSaving(true);
    try {
      const updated = await learningApi.markComplete(active.id);
      setLessons((prev) =>
        prev ? prev.map((l) => (l.id === updated.id ? updated : l)) : prev,
      );
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
                {active.type === "video" ? (
                  <div className="aspect-video w-full overflow-hidden rounded-[var(--radius-card)] bg-black">
                    <iframe
                      className="h-full w-full"
                      src={active.videoUrl}
                      title={active.title}
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <article className="rounded-[var(--radius-card)] border border-border bg-surface p-6 leading-relaxed text-gray-700">
                    {active.body}
                  </article>
                )}
              </div>
              <div className="mt-4">
                <Button onClick={markComplete} loading={saving} disabled={active.completed}>
                  {active.completed ? "✓ Completed" : "Mark complete"}
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
                  <span>{l.completed ? "✓" : l.type === "video" ? "▶" : "📄"}</span>
                  <span className="flex-1">{l.title}</span>
                  <span className="text-xs text-gray-400">{l.durationMinutes}m</span>
                </button>
              </li>
            ))}
          </ul>
        </aside>
      </div>
    </div>
  );
}
