"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, Button, Loader } from "@lms/ui";
import { assignmentsApi, type Assignment } from "@lms/api-client";
import { StatusBadge } from "./status";

export default function AssignmentsPage() {
  const [items, setItems] = useState<Assignment[] | null>(null);

  useEffect(() => {
    assignmentsApi.list().then(setItems).catch(() => setItems([]));
  }, []);

  return (
    <div className="mx-auto max-w-4xl">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Assignments</h1>
        <div className="flex gap-2">
          <Link href="/quiz/q1">
            <Button size="sm" variant="secondary">Take quiz</Button>
          </Link>
          <Link href="/grades">
            <Button size="sm" variant="secondary">My grades</Button>
          </Link>
        </div>
      </div>

      {items === null ? (
        <div className="mt-10 flex justify-center">
          <Loader size="lg" label="Loading…" />
        </div>
      ) : (
        <div className="mt-8 flex flex-col gap-3">
          {items.map((a) => (
            <Card key={a.id}>
              <div className="flex items-center justify-between">
                <div>
                  <Link href={`/${a.id}`} className="font-medium text-gray-900 hover:text-brand-700">
                    {a.title}
                  </Link>
                  <p className="mt-1 text-xs text-gray-500">Due {a.dueDate}</p>
                </div>
                <div className="flex items-center gap-3">
                  <StatusBadge status={a.status} />
                  <Link href={`/${a.id}`}>
                    <Button size="sm">Open</Button>
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
