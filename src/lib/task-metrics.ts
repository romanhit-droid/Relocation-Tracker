import type { Task } from "@/types/task";

function startOfToday(): Date {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

function addDays(d: Date, n: number): Date {
  const x = new Date(d);
  x.setDate(x.getDate() + n);
  return x;
}

export type DueBucket = "overdue" | "due_7" | "due_30" | "no_date" | "ok";

export function parseTaskDate(s: string | null): Date | null {
  if (!s) return null;
  const d = new Date(s + "T12:00:00");
  return Number.isNaN(d.getTime()) ? null : d;
}

export function dueBucket(task: Task): DueBucket {
  if (task.status === "Done") return "ok";
  const due = parseTaskDate(task.target_date);
  if (!due) return "no_date";
  const today = startOfToday();
  if (due < today) return "overdue";
  if (due <= addDays(today, 7)) return "due_7";
  if (due <= addDays(today, 30)) return "due_30";
  return "ok";
}

export function isAtRisk(task: Task): boolean {
  if (task.status === "Done") return false;
  if (task.priority !== "High" || task.status !== "Not started") return false;
  const due = parseTaskDate(task.target_date);
  if (!due) return false;
  const today = startOfToday();
  return due <= addDays(today, 14) && due >= today;
}

export function progressByPhase(tasks: Task[]): { phase: string; pct: number; done: number; total: number }[] {
  const map = new Map<string, { done: number; total: number }>();
  for (const t of tasks) {
    const p = t.phase?.trim() || "Uncategorized";
    const cur = map.get(p) ?? { done: 0, total: 0 };
    cur.total += 1;
    if (t.status === "Done") cur.done += 1;
    map.set(p, cur);
  }
  return Array.from(map.entries())
    .map(([phase, { done, total }]) => ({
      phase,
      done,
      total,
      pct: total ? Math.round((done / total) * 100) : 0,
    }))
    .sort((a, b) => b.total - a.total);
}
