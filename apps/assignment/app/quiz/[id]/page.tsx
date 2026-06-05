"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Button, Card, Loader, cn } from "@lms/ui";
import { assignmentsApi, type Quiz, type QuizResult } from "@lms/api-client";

export default function QuizPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [quiz, setQuiz] = useState<Quiz | null | undefined>(undefined);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<QuizResult | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    assignmentsApi.getQuiz(id).then(setQuiz).catch(() => setQuiz(null));
  }, [id]);

  async function onSubmit() {
    if (!quiz) return;
    setSubmitting(true);
    try {
      const ordered = quiz.questions.map((_, i) => answers[i] ?? -1);
      setResult(await assignmentsApi.submitQuiz(quiz.id, ordered));
    } finally {
      setSubmitting(false);
    }
  }

  if (quiz === undefined) {
    return (
      <div className="mt-10 flex justify-center">
        <Loader size="lg" label="Loading quiz…" />
      </div>
    );
  }
  if (quiz === null) {
    return (
      <div className="mx-auto max-w-3xl">
        <p className="text-gray-600">Quiz not found.</p>
        <Link href="/" className="mt-4 inline-block text-brand-700 hover:underline">← Back</Link>
      </div>
    );
  }

  const allAnswered = quiz.questions.every((_, i) => answers[i] !== undefined);

  return (
    <div className="mx-auto max-w-3xl">
      <Link href="/" className="text-sm text-brand-700 hover:underline">← Assignments</Link>
      <h1 className="mt-4 text-2xl font-bold text-gray-900">{quiz.title}</h1>

      {result ? (
        <Card className="mt-6">
          <p className="text-lg font-semibold text-gray-900">
            Score: {result.score} / {result.maxScore}
          </p>
          <p className="mt-1 text-sm text-gray-600">
            {result.score === result.maxScore ? "Perfect! 🎉" : "Review the lessons and retry."}
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
                {q.options.map((opt, oi) => (
                  <button
                    key={oi}
                    onClick={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                    className={cn(
                      "rounded-lg border px-3 py-2 text-left text-sm",
                      answers[qi] === oi
                        ? "border-brand-500 bg-brand-50 text-brand-700"
                        : "border-border hover:bg-surface-muted",
                    )}
                  >
                    {opt}
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
