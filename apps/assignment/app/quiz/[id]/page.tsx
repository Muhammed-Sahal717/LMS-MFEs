"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Button, Card, Loader, cn } from "@lms/ui";
import { assignmentsApi, type AssignmentOut, type SubmissionOut } from "@lms/api-client";

export default function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [assignment, setAssignment] = useState<AssignmentOut | null | undefined>(undefined);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [result, setResult] = useState<SubmissionOut | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    assignmentsApi.get(id).then(setAssignment).catch(() => setAssignment(null));
  }, [id]);

  const quiz = assignment?.quiz;

  async function onSubmit() {
    if (!quiz) return;
    setSubmitting(true);
    try {
      const payload: Record<string, string[]> = {};
      quiz.questions.forEach((q) => {
        const answerId = answers[q.id];
        if (answerId) payload[q.id] = [answerId];
      });
      setResult(await assignmentsApi.submit(id, { answers: payload }));
    } finally {
      setSubmitting(false);
    }
  }

  if (assignment === undefined) {
    return (
      <div className="mt-10 flex justify-center">
        <Loader size="lg" label="Loading quiz…" />
      </div>
    );
  }
  if (assignment === null || !quiz) {
    return (
      <div className="mx-auto max-w-3xl">
        <p className="text-gray-600">Quiz not found.</p>
        <Link href="/" className="mt-4 inline-block text-brand-700 hover:underline">← Back</Link>
      </div>
    );
  }

  const allAnswered = quiz.questions.every((q) => answers[q.id] !== undefined);

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/" className="text-sm text-brand-700 hover:underline">← Assignments</Link>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">{assignment.title}</h1>

      {result ? (
        <Card className="mt-6">
          <p className="text-lg font-semibold text-gray-900">Quiz submitted</p>
          <p className="mt-1 text-sm text-gray-600">
            Your submission is {result.status}.
          </p>
          <div className="mt-4">
            <Button size="sm" variant="secondary" onClick={() => { setResult(null); setAnswers({}); }}>
              Retake
            </Button>
          </div>
        </Card>
      ) : (
        <div className="mt-6 flex flex-col gap-5">
          {quiz.questions.map((q, qi) => (
            <Card key={q.id}>
              <p className="font-medium text-gray-900">{qi + 1}. {q.text}</p>
              <div className="mt-3 flex flex-col gap-2">
                {q.answers.map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setAnswers((a) => ({ ...a, [q.id]: opt.id }))}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-left text-sm",
                      answers[q.id] === opt.id
                        ? "border-brand-500 bg-brand-50 text-brand-700"
                        : "border-border hover:bg-surface-muted",
                    )}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </Card>
          ))}
          <div>
            <Button onClick={onSubmit} loading={submitting} disabled={!allAnswered}>
              Submit quiz
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
