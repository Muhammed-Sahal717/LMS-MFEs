"use client";

import { use, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button, Loader, ProgressBar, cn, Card, CardContent } from "@lms/ui";
import { learningApi, type LessonOut } from "@lms/api-client";
import { ArrowLeft, Check, FileText, PackageOpen, Video, CheckCircle2 } from "lucide-react";

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
      <div className="mt-32 flex justify-center">
        <Loader size="lg" label="Loading curriculum..." />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] animate-in fade-in duration-500 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--muted-foreground))] hover:text-[hsl(var(--foreground))] transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Dashboard
        </Link>
        <div className="w-full sm:w-64">
          <ProgressBar value={progress} showLabel />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1fr_350px] xl:grid-cols-[1fr_400px]">
        {/* Main Content Area */}
        <div className="flex flex-col min-w-0">
          {active ? (
            <div className="flex flex-col flex-1 gap-6">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-[hsl(var(--foreground))] tracking-tight">{active.title}</h1>
              </div>
              
              <Card className="w-full overflow-hidden border-[hsl(var(--border))] shadow-[var(--shadow-md)]">
                {active.content_type === "video" ? (
                  <div className="aspect-video w-full bg-black">
                    <iframe
                      className="h-full w-full"
                      src={active.video?.hls_url ?? active.video?.url ?? undefined}
                      title={active.title}
                      allowFullScreen
                    />
                  </div>
                ) : (
                  <article className="min-h-[500px] bg-[hsl(var(--card))] p-8 sm:p-12 prose prose-sm sm:prose-base dark:prose-invert max-w-none text-[hsl(var(--foreground))]">
                    {active.document?.file_url ?? (
                      <div className="flex flex-col items-center justify-center h-[400px] text-center text-[hsl(var(--muted-foreground))]">
                        <FileText className="w-12 h-12 mb-4 opacity-50" />
                        <p>Document content goes here.</p>
                      </div>
                    )}
                  </article>
                )}
              </Card>

              <Card className="border-[hsl(var(--border))] shadow-sm bg-[hsl(var(--card))]">
                <CardContent className="p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-[hsl(var(--foreground))]">Lesson Progress</h3>
                    <p className="text-sm text-[hsl(var(--muted-foreground))] mt-0.5">Complete this lesson to advance your overall progress.</p>
                  </div>
                  <Button 
                    onClick={markComplete} 
                    loading={saving} 
                    disabled={completed[active.id]}
                    size="md"
                    variant={completed[active.id] ? "outline" : "default"}
                    className={cn(
                      "w-full sm:w-auto shrink-0",
                      completed[active.id] && "border-success-500/50 bg-success-50 text-success-700 dark:bg-success-950/20 dark:text-success-400"
                    )}
                  >
                    {completed[active.id] ? (
                      <><CheckCircle2 className="w-4 h-4 mr-2" /> Completed</>
                    ) : "Mark complete"}
                  </Button>
                </CardContent>
              </Card>
            </div>
          ) : (
            <Card className="flex flex-col items-center justify-center h-[500px] bg-[hsl(var(--muted)/0.3)] border-dashed border-[hsl(var(--border))] text-center shadow-none">
              <PackageOpen className="w-12 h-12 text-[hsl(var(--muted-foreground))] opacity-50 mb-4" />
              <h3 className="text-lg font-semibold text-[hsl(var(--foreground))]">No Lessons Found</h3>
              <p className="mt-1 text-sm text-[hsl(var(--muted-foreground))]">This course doesn't have any lessons uploaded yet.</p>
            </Card>
          )}
        </div>

        {/* Course Curriculum Sidebar */}
        <aside className="flex flex-col h-[calc(100vh-120px)] sticky top-6 overflow-hidden rounded-[var(--radius-lg)] border border-[hsl(var(--border))] bg-[hsl(var(--card))] shadow-[var(--shadow-sm)]">
          <div className="px-5 py-4 border-b border-[hsl(var(--border))] bg-[hsl(var(--muted)/0.3)]">
            <h2 className="text-base font-semibold text-[hsl(var(--foreground))] tracking-tight">Course Curriculum</h2>
            <p className="text-xs text-[hsl(var(--muted-foreground))] mt-0.5">{lessons.length} total lessons</p>
          </div>
          
          <ul className="flex-1 overflow-y-auto p-2 space-y-0.5">
            {lessons.map((l, index) => {
              const isActive = l.id === activeId;
              const isDone = completed[l.id];
              return (
                <li key={l.id}>
                  <button
                    onClick={() => setActiveId(l.id)}
                    className={cn(
                      "group flex w-full items-start gap-3 rounded-[var(--radius-md)] px-3 py-2.5 text-left transition-all",
                      isActive
                        ? "bg-[hsl(var(--accent))] shadow-sm"
                        : "hover:bg-[hsl(var(--accent)/0.5)]",
                    )}
                  >
                    <div className={cn(
                      "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-medium mt-0.5 transition-colors",
                      isDone ? "bg-success-100 text-success-700 dark:bg-success-900/50 dark:text-success-400" : 
                      isActive ? "bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]" : "bg-[hsl(var(--muted))] text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--foreground))]"
                    )}>
                      {isDone ? <Check className="w-3.5 h-3.5" /> : (index + 1)}
                    </div>
                    
                    <div className="flex flex-1 flex-col min-w-0">
                      <span className={cn(
                        "text-sm font-medium leading-tight truncate",
                        isActive ? "text-[hsl(var(--foreground))]" : "text-[hsl(var(--muted-foreground))] group-hover:text-[hsl(var(--foreground))]"
                      )}>
                        {l.title}
                      </span>
                      <div className="flex items-center gap-1.5 mt-1.5 text-[11px] text-[hsl(var(--muted-foreground))]">
                        <span className="flex items-center gap-1 opacity-70">
                          {l.content_type === "video" ? <Video className="w-3 h-3" /> : <FileText className="w-3 h-3" />} 
                          <span className="capitalize">{l.content_type}</span>
                        </span>
                        <span className="opacity-50">•</span>
                        <span className="opacity-80">{Math.round(l.duration_seconds / 60)} min</span>
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
