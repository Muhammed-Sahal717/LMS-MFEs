"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, Loader, ProgressBar } from "@lms/ui";
import { assignmentsApi, type GradeView } from "@lms/api-client";

export default function GradesPage() {
  const [grades, setGrades] = useState<GradeView[] | null>(null);

  useEffect(() => {
    assignmentsApi.grades().then(setGrades).catch(() => setGrades([]));
  }, []);

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/" className="text-sm text-brand-700 hover:underline">← Assignments</Link>
      <h1 className="mt-4 text-3xl font-bold text-gray-900">My Grades</h1>

      {grades === null ? (
        <div className="mt-10 flex justify-center">
          <Loader size="lg" label="Loading…" />
        </div>
      ) : grades.length === 0 ? (
        <p className="mt-10 text-gray-500">No grades yet.</p>
      ) : (
        <div className="mt-8 flex flex-col gap-3">
          {grades.map((g) => (
            <Card key={g.assignmentId} header={<span>{g.title}</span>}>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">
                  {g.score}
                  <span className="text-base font-normal text-gray-400">/{g.maxScore}</span>
                </span>
                <div className="w-40">
                  <ProgressBar value={(g.score / g.maxScore) * 100} showLabel />
                </div>
              </div>
              {g.feedback ? (
                <p className="mt-3 rounded-lg bg-surface-muted p-3 text-sm text-gray-600">
                  💬 {g.feedback}
                </p>
              ) : null}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
