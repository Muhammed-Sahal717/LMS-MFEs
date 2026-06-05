import type { Assignment } from "@lms/api-client";

const styles: Record<Assignment["status"], string> = {
  pending: "bg-amber-50 text-amber-700",
  submitted: "bg-blue-50 text-blue-700",
  graded: "bg-brand-50 text-brand-700",
};

export function StatusBadge({ status }: { status: Assignment["status"] }) {
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status]}`}>
      {status}
    </span>
  );
}
