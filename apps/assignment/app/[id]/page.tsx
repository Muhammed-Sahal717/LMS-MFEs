"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Button, Card, CardHeader, CardTitle, CardContent, Loader, cn } from "@lms/ui";
import { assignmentsApi, type AssignmentOut, type SubmissionOut } from "@lms/api-client";
import { StatusBadge } from "../status";
import { ArrowLeft, Calendar, FileText, CheckCircle2 } from "lucide-react";

export default function AssignmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [assignment, setAssignment] = useState<AssignmentOut | null | undefined>(undefined);
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);
  const [submission, setSubmission] = useState<SubmissionOut | null>(null);

  useEffect(() => {
    assignmentsApi.get(id).then(setAssignment).catch(() => setAssignment(null));
  }, [id]);

  async function onSubmit() {
    if (!assignment) return;
    setSaving(true);
    try {
      const res = await assignmentsApi.submit(assignment.id, { content: text });
      setSubmission(res);
    } finally {
      setSaving(false);
    }
  }

  if (assignment === undefined) {
    return (
      <div className="mt-32 flex justify-center">
        <Loader size="lg" label="Loading assignment details..." />
      </div>
    );
  }
  
  if (assignment === null) {
    return (
      <div className="mx-auto max-w-3xl py-20 text-center">
        <h2 className="text-2xl font-semibold text-[hsl(var(--foreground))]">Assignment not found</h2>
        <p className="mt-2 text-[hsl(var(--muted-foreground))]">The assignment you are looking for does not exist.</p>
        <Link href="/" className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--primary))] hover:underline">
          <ArrowLeft size={16} /> Back to assignments
        </Link>
      </div>
    );
  }

  const locked = !assignment.is_published || !!submission;

  return (
    <div className="mx-auto max-w-4xl space-y-8 animate-in fade-in duration-500 pb-10">
      <Link href="/" className="inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]">
        <ArrowLeft size={16} /> Back to Assignments
      </Link>
      
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <StatusBadge type={assignment.type} published={assignment.is_published} />
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-[hsl(var(--foreground))]">{assignment.title}</h1>
            <div className="flex items-center gap-2 text-sm font-medium text-[hsl(var(--muted-foreground))]">
              <Calendar className="h-4 w-4" />
              <span>{assignment.due_at ? `Due ${new Date(assignment.due_at).toLocaleDateString()}` : "No due date"}</span>
            </div>
          </div>
        </div>
      </div>

      <Card className="border-[hsl(var(--border))] shadow-sm overflow-hidden">
        <CardHeader className="bg-[hsl(var(--muted)/0.3)] border-b border-[hsl(var(--border))] pb-4">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="h-5 w-5 text-[hsl(var(--primary))]" />
            Submission
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {locked ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              {submission ? (
                <>
                  <div className="h-16 w-16 rounded-full bg-success-50 dark:bg-success-950/30 flex items-center justify-center mb-4 text-success-600 dark:text-success-400">
                    <CheckCircle2 className="h-8 w-8" />
                  </div>
                  <h3 className="text-xl font-semibold text-[hsl(var(--foreground))]">Assignment Submitted</h3>
                  <p className="mt-2 text-[hsl(var(--muted-foreground))] max-w-md">Your work has been submitted successfully and is currently awaiting grading by your instructor.</p>
                </>
              ) : (
                <>
                  <div className="h-16 w-16 rounded-full bg-[hsl(var(--muted))] flex items-center justify-center mb-4 text-[hsl(var(--muted-foreground))]">
                    <FileText className="h-8 w-8 opacity-50" />
                  </div>
                  <h3 className="text-xl font-semibold text-[hsl(var(--foreground))]">Assignment Closed</h3>
                  <p className="mt-2 text-[hsl(var(--muted-foreground))] max-w-md">This assignment is not currently open for submissions.</p>
                </>
              )}
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              <label htmlFor="submission-content" className="text-sm font-semibold text-[hsl(var(--foreground))]">
                Your Answer
              </label>
              <textarea
                id="submission-content"
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={8}
                placeholder="Paste your answer or provide a link to your work here..."
                className="w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-4 text-sm text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:border-transparent transition-all resize-y shadow-sm"
              />
              <div className="flex justify-end pt-2">
                <Button onClick={onSubmit} loading={saving} disabled={!text.trim()} size="lg" className="w-full sm:w-auto px-8 shadow-sm">
                  Submit Assignment
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
