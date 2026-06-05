"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Button, Card, Loader } from "@lms/ui";
import { assignmentsApi, type Assignment } from "@lms/api-client";
import { StatusBadge } from "../status";

export default function AssignmentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [assignment, setAssignment] = useState<Assignment | null | undefined>(undefined);
  const [text, setText] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    assignmentsApi.get(id).then(setAssignment).catch(() => setAssignment(null));
  }, [id]);

  async function onSubmit() {
    if (!assignment) return;
    setSaving(true);
    try {
      const updated = await assignmentsApi.submit(assignment.id, text);
      setAssignment(updated);
    } finally {
      setSaving(false);
    }
  }

  if (assignment === undefined) {
    return (
      <div className="mt-10 flex justify-center">
        <Loader size="lg" label="Loading…" />
      </div>
    );
  }
  if (assignment === null) {
    return (
      <div className="mx-auto max-w-3xl">
        <p className="text-gray-600">Assignment not found.</p>
        <Link href="/" className="mt-4 inline-block text-brand-700 hover:underline">
          ← Back
        </Link>
      </div>
    );
  }

  const locked = assignment.status !== "pending";

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/" className="text-sm text-brand-700 hover:underline">
        ← Assignments
      </Link>
      <div className="mt-4 flex items-center gap-3">
        <h1 className="text-2xl font-bold text-gray-900">{assignment.title}</h1>
        <StatusBadge status={assignment.status} />
      </div>
      <p className="mt-1 text-sm text-gray-500">Due {assignment.dueDate}</p>

      <Card className="mt-6">
        {locked ? (
          <p className="text-sm text-gray-600">
            {assignment.status === "graded"
              ? "This assignment has been graded. See your grades."
              : "Submitted. Awaiting grading."}
          </p>
        ) : (
          <div className="flex flex-col gap-3">
            <label className="text-sm font-medium text-gray-700">Your submission</label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={6}
              placeholder="Paste your answer or a link to your work…"
              className="rounded-lg border border-border p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
            <div>
              <Button onClick={onSubmit} loading={saving} disabled={!text.trim()}>
                Submit assignment
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
