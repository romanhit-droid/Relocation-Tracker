import type { Task } from "@/types/task";
import { dueBucket, isAtRisk } from "@/lib/task-metrics";

function Card({
  label,
  value,
  hint,
  tone,
}: {
  label: string;
  value: number;
  hint?: string;
  tone?: "default" | "amber" | "red" | "slate";
}) {
  const tones = {
    default: "border-surface-border bg-surface-card",
    amber: "border-amber-500/40 bg-amber-950/30",
    red: "border-red-500/40 bg-red-950/30",
    slate: "border-slate-600/40 bg-slate-900/40",
  };
  return (
    <div className={`rounded-xl border p-4 ${tones[tone ?? "default"]}`}>
      <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
        {label}
      </p>
      <p className="mt-2 text-3xl font-semibold tabular-nums text-white">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-500">{hint}</p>}
    </div>
  );
}

export function DashboardStats({ tasks }: { tasks: Task[] }) {
  const active = tasks.filter((t) => t.status !== "Done");
  const done = tasks.length - active.length;
  const pct = tasks.length ? Math.round((done / tasks.length) * 100) : 0;

  let overdue = 0;
  let due7 = 0;
  let due30 = 0;
  let noDate = 0;
  let atRisk = 0;

  for (const t of tasks) {
    if (t.status === "Done") continue;
    const b = dueBucket(t);
    if (b === "overdue") overdue += 1;
    else if (b === "due_7") due7 += 1;
    else if (b === "due_30") due30 += 1;
    else if (b === "no_date") noDate += 1;
    if (isAtRisk(t)) atRisk += 1;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-white">Dashboard</h1>
          <p className="text-sm text-slate-400">
            Overall progress:{" "}
            <span className="font-medium text-slate-200">{pct}%</span> complete (
            {done}/{tasks.length} tasks)
          </p>
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <Card label="Overdue" value={overdue} tone={overdue ? "red" : "default"} />
        <Card
          label="Next 7 days"
          value={due7}
          tone={due7 ? "amber" : "default"}
        />
        <Card
          label="8–30 days"
          value={due30}
          hint="Excludes the next 7 days"
        />
        <Card
          label="High risk"
          value={atRisk}
          hint="High priority, not started, due ≤14d"
          tone={atRisk ? "amber" : "default"}
        />
        <Card
          label="No target date"
          value={noDate}
          hint="Active tasks missing a date"
          tone={noDate ? "slate" : "default"}
        />
        <Card label="Active tasks" value={active.length} />
      </div>
    </div>
  );
}
