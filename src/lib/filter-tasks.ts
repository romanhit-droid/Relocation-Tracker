import type { Task } from "@/types/task";
import { dueBucket, isAtRisk } from "@/lib/task-metrics";

export type TaskSearchParams = {
  q?: string;
  phase?: string;
  section?: string;
  status?: string;
  due?: string;
};

export function filterTasks(tasks: Task[], sp: TaskSearchParams): Task[] {
  const q = sp.q?.trim().toLowerCase();
  let out = tasks;

  if (q) {
    out = out.filter(
      (t) =>
        t.title.toLowerCase().includes(q) ||
        (t.notes?.toLowerCase().includes(q) ?? false) ||
        (t.phase?.toLowerCase().includes(q) ?? false),
    );
  }
  if (sp.phase) out = out.filter((t) => t.phase === sp.phase);
  if (sp.section) out = out.filter((t) => t.section === sp.section);
  if (sp.status) out = out.filter((t) => t.status === sp.status);

  if (sp.due && sp.due !== "all") {
    out = out.filter((t) => {
      switch (sp.due) {
        case "overdue":
          return dueBucket(t) === "overdue";
        case "7":
          return dueBucket(t) === "due_7";
        case "30":
          return dueBucket(t) === "due_30";
        case "none":
          return dueBucket(t) === "no_date";
        case "risk":
          return isAtRisk(t);
        default:
          return true;
      }
    });
  }

  return out;
}

export function uniqueStrings(values: (string | null | undefined)[]): string[] {
  const s = new Set<string>();
  for (const v of values) {
    if (v && v.trim()) s.add(v.trim());
  }
  return Array.from(s).sort((a, b) => a.localeCompare(b));
}
