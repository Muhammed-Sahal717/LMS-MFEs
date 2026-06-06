import { Badge } from "@lms/ui";

export function StatusBadge({ type, published }: { type: "assignment" | "quiz"; published: boolean }) {
  if (!published) return <Badge variant="default">Draft</Badge>;
  if (type === "quiz") return <Badge variant="info">Quiz</Badge>;
  return <Badge variant="warning">Assignment</Badge>;
}
