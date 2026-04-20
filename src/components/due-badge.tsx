import type { Task } from "@/types/task";
import { dueBucket } from "@/lib/task-metrics";

export function DueBadge({ task }: { task: Task }) {
  if (task.status === "Done") {
    return (
      <span className="rounded-md bg-slate-800 px-2 py-0.5 text-xs text-slate-500">
        Done
      </span>
    );
  }
  const b = dueBucket(task);
  const map: Record<string, { label: string; className: string }> = {
    overdue: { label: "Overdue", className: "bg-red-950 text-red-200" },
    due_7: { label: "≤7 days", className: "bg-amber-950 text-amber-200" },
    due_30: { label: "≤30 days", className: "bg-sky-950 text-sky-200" },
    no_date: { label: "No date", className: "bg-slate-800 text-slate-400" },
    ok: { label: "On track", className: "bg-emerald-950/60 text-emerald-200" },
  };
  const x = map[b] ?? map.ok;
  return (
    <span className={`rounded-md px-2 py-0.5 text-xs ${x.className}`}>
      {x.label}
    </span>
  );
}
