const styles = {
  assignment: "bg-amber-50 text-amber-700",
  quiz: "bg-blue-50 text-blue-700",
  draft: "bg-surface-muted text-gray-600",
};

export function StatusBadge({ type, published }: { type: "assignment" | "quiz"; published: boolean }) {
  const label = published ? type : "draft";
  const style = published ? styles[type] : styles.draft;
  return (
    <span className={`rounded-full px-2.5 py-0.5 text-xs font-medium ${style}`}>
      {label}
    </span>
  );
}
