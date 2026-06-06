"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, Button, Loader } from "@lms/ui";
import { assignmentsApi, type AssignmentOut } from "@lms/api-client";
import { StatusBadge } from "./status";
import { FileEdit, HelpCircle, CheckCheck } from "lucide-react";

export default function AssignmentsPage() {
  const [items, setItems] = useState<AssignmentOut[] | null>(null);

  useEffect(() => {
    assignmentsApi.list().then(setItems).catch(() => setItems([]));
  }, []);

  return (
    <div className="mx-auto max-w-5xl animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Assignments</h1>
          <p className="mt-2 text-gray-500">Track and submit your coursework.</p>
        </div>
        <Link href="/grades">
          <Button variant="secondary" className="w-full sm:w-auto">View My Grades</Button>
        </Link>
      </div>

      {items === null ? (
        <div className="mt-20 flex flex-col items-center justify-center">
          <Loader size="lg" label="Loading assignments…" />
        </div>
      ) : items.length === 0 ? (
        <div className="mt-12 flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed border-gray-300 bg-gray-50">
          <CheckCheck className="text-gray-400 w-16 h-16 mb-4" />
          <h3 className="text-lg font-semibold text-gray-900">No Assignments Yet</h3>
          <p className="mt-2 text-gray-500">You don't have any pending or completed assignments. Enjoy the free time!</p>
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-4">
          {items.map((a) => (
            <Card key={a.id} interactive className="hover:border-gray-300">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gray-100 text-gray-500">
                    {a.type === "quiz" ? <HelpCircle className="w-6 h-6" /> : <FileEdit className="w-6 h-6" />}
                  </div>
                  <div>
                    <Link href={`/${a.id}`} className="text-lg font-bold text-gray-900 hover:text-brand-600 transition-colors">
                      {a.title}
                    </Link>
                    <div className="flex items-center gap-3 mt-1.5 text-sm">
                      <StatusBadge type={a.type} published={a.is_published} />
                      <span className="text-gray-400">•</span>
                      <span className="text-gray-500">
                        {a.due_at ? `Due ${new Date(a.due_at).toLocaleDateString()}` : "No due date"}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex shrink-0">
                  <Link href={`/${a.id}`}>
                    <Button>Open Assignment</Button>
                  </Link>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
