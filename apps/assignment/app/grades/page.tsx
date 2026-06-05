"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, Loader, ProgressBar } from "@lms/ui";
import { assignmentsApi, type GradeOut } from "@lms/api-client";

export default function GradesPage() {
  const [grades, setGrades] = useState<GradeOut[] | null>(null);

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
          {grades.map((g) => {
            const points = Number(g.points);
            const maxPoints = Number(g.max_points);
            return (
            <Card key={g.assignment_id} header={<span>Assignment {g.assignment_id.slice(0, 8)}</span>}>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-gray-900">
                  {Number.isFinite(points) ? points : g.points}
                  <span className="text-base font-normal text-gray-400">/{Number.isFinite(maxPoints) ? maxPoints : g.max_points}</span>
                </span>
                <div className="w-40">
                  <ProgressBar
                    value={Number.isFinite(points) && Number.isFinite(maxPoints) && maxPoints > 0 ? (points / maxPoints) * 100 : 0}
                    showLabel
                  />
                </div>
              </div>
              {g.feedback ? (
                <p className="mt-3 rounded-lg bg-surface-muted p-3 text-sm text-gray-600">
                  💬 {g.feedback}
                </p>
              ) : null}
            </Card>
          );})}
        </div>
      )}
    </div>
  );
}
