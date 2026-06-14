"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Button, Card, CardHeader, CardTitle, CardContent, Loader, Badge, EmptyState } from "@lms/ui";
import { assignmentsApi, adminApi, type AssignmentOut, type SubmissionOut, type UserOut } from "@lms/api-client";
import { ArrowLeft, CheckCircle2, Clock, FileText, User } from "lucide-react";

export default function AssignmentSubmissionsPage({
  params,
}: {
  params: Promise<{ id: string; assignmentId: string }>;
}) {
  const { id, assignmentId } = use(params);
  const [assignment, setAssignment] = useState<AssignmentOut | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionOut[]>([]);
  const [users, setUsers] = useState<Record<string, UserOut>>({});
  const [loading, setLoading] = useState(true);

  const fetchData = () => {
    setLoading(true);
    Promise.all([
      assignmentsApi.get(assignmentId),
      assignmentsApi.getSubmissions(assignmentId),
      adminApi.users()
    ]).then(([asg, subs, usersList]) => {
      setAssignment(asg);
      setSubmissions(subs);
      
      const userMap: Record<string, UserOut> = {};
      usersList.forEach(u => userMap[u.id] = u);
      setUsers(userMap);
    }).finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchData();
  }, [assignmentId]);

  if (loading) {
    return (
      <div className="mt-32 flex justify-center">
        <Loader size="lg" label="Loading submissions..." />
      </div>
    );
  }

  if (!assignment) {
    return (
      <div className="mx-auto max-w-3xl py-20 text-center">
        <h2 className="text-2xl font-semibold text-[hsl(var(--foreground))]">Assignment not found</h2>
        <Link href={`/courses/${id}`} className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--primary))] hover:underline">
          <ArrowLeft size={16} /> Back to Course
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-8 animate-in fade-in duration-500 pb-20">
      <Link href={`/courses/${id}`} className="inline-flex items-center gap-2 text-sm font-medium text-[hsl(var(--muted-foreground))] transition-colors hover:text-[hsl(var(--foreground))]">
        <ArrowLeft size={16} /> Back to Course
      </Link>
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-[hsl(var(--foreground))]">Submissions</h1>
          <p className="text-[hsl(var(--muted-foreground))] mt-1">Reviewing submissions for "{assignment.title}"</p>
        </div>
        <div className="flex gap-2">
          <Badge variant="secondary" className="px-3 py-1 text-sm rounded-full">
            <FileText className="w-4 h-4 mr-2 inline" />
            {submissions.length} Total
          </Badge>
          <Badge variant="success" className="px-3 py-1 text-sm rounded-full">
            <CheckCircle2 className="w-4 h-4 mr-2 inline" />
            {submissions.filter(s => s.status === 'graded').length} Graded
          </Badge>
        </div>
      </div>

      {submissions.length === 0 ? (
        <EmptyState
          icon={<FileText className="w-8 h-8" />}
          title="No submissions yet"
          description="Students have not submitted any work for this assignment yet."
          variant="dashed"
        />
      ) : (
        <div className="space-y-6">
          {submissions.map(submission => (
            <SubmissionCard 
              key={submission.id} 
              submission={submission} 
              assignment={assignment} 
              user={users[submission.user_id]} 
              onGraded={fetchData} 
            />
          ))}
        </div>
      )}
    </div>
  );
}

function SubmissionCard({ 
  submission, 
  assignment, 
  user, 
  onGraded 
}: { 
  submission: SubmissionOut; 
  assignment: AssignmentOut; 
  user?: UserOut; 
  onGraded: () => void;
}) {
  const [points, setPoints] = useState<number | "">("");
  const [feedback, setFeedback] = useState("");
  const [saving, setSaving] = useState(false);

  const handleGrade = async () => {
    if (points === "") return;
    setSaving(true);
    try {
      await assignmentsApi.gradeSubmission(submission.id, { points: Number(points), feedback });
      onGraded();
    } finally {
      setSaving(false);
    }
  };

  const isGraded = submission.status === 'graded';

  return (
    <Card className="border-[hsl(var(--border))] overflow-hidden transition-all hover:shadow-[var(--shadow-sm)]">
      <CardHeader className="bg-[hsl(var(--muted)/0.3)] border-b border-[hsl(var(--border))] py-4 px-6 flex flex-row items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-[hsl(var(--primary)/0.1)] flex items-center justify-center text-[hsl(var(--primary))]">
            <User className="h-5 w-5" />
          </div>
          <div>
            <CardTitle className="text-base font-semibold text-[hsl(var(--foreground))]">
              {user ? user.full_name : "Unknown Student"}
            </CardTitle>
            <p className="text-xs text-[hsl(var(--muted-foreground))] flex items-center gap-1 mt-0.5">
              <Clock className="w-3 h-3" /> Submitted {new Date(submission.submitted_at).toLocaleString()}
            </p>
          </div>
        </div>
        <div>
          {isGraded ? (
            <Badge variant="success" className="gap-1">
              <CheckCircle2 className="w-3 h-3" /> Graded
            </Badge>
          ) : (
            <Badge variant="warning" className="gap-1">
              <Clock className="w-3 h-3" /> Needs Grading
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-6">
        <div className="bg-[hsl(var(--background))] rounded-[var(--radius-md)] border border-[hsl(var(--border))] p-4 mb-6">
          <h4 className="text-xs font-semibold uppercase tracking-wider text-[hsl(var(--muted-foreground))] mb-2">Student's Work</h4>
          <p className="text-sm text-[hsl(var(--foreground))] whitespace-pre-wrap">
            {submission.content || <span className="italic opacity-50">No text content provided.</span>}
          </p>
        </div>

        {!isGraded ? (
          <div className="bg-[hsl(var(--muted)/0.4)] rounded-lg p-5 border border-[hsl(var(--border))]">
            <h4 className="text-sm font-semibold text-[hsl(var(--foreground))] mb-4">Grade Submission</h4>
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
              <div className="space-y-2 w-full sm:w-32">
                <label className="text-xs font-medium text-[hsl(var(--foreground))] uppercase tracking-wider">Points (Max {assignment.max_points})</label>
                <input
                  type="number"
                  value={points}
                  max={Number(assignment.max_points)}
                  min={0}
                  onChange={(e) => setPoints(e.target.value === "" ? "" : Number(e.target.value))}
                  className="w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-2.5 text-sm focus:ring-2 focus:ring-[hsl(var(--ring))] outline-none"
                  placeholder="0"
                />
              </div>
              <div className="space-y-2 flex-1 w-full">
                <label className="text-xs font-medium text-[hsl(var(--foreground))] uppercase tracking-wider">Feedback (Optional)</label>
                <input
                  type="text"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full rounded-[var(--radius-md)] border border-[hsl(var(--border))] bg-[hsl(var(--background))] p-2.5 text-sm focus:ring-2 focus:ring-[hsl(var(--ring))] outline-none"
                  placeholder="Provide constructive feedback..."
                />
              </div>
              <Button onClick={handleGrade} loading={saving} disabled={points === ""} className="w-full sm:w-auto shadow-sm">
                Submit Grade
              </Button>
            </div>
          </div>
        ) : (
          <div className="bg-[hsl(var(--success)/0.1)] dark:bg-[hsl(var(--success)/0.2)] rounded-lg p-4 border border-[hsl(var(--success)/0.3)] flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-[hsl(var(--success)/0.2)] flex items-center justify-center text-[hsl(var(--success))]">
              <CheckCircle2 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm font-medium text-[hsl(var(--success))]">
                You have already graded this submission.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
