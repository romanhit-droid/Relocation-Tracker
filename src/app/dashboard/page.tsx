import { createClient } from "@/lib/supabase/server";
import { DashboardStats } from "@/components/dashboard-stats";
import { PhaseChart } from "@/components/phase-chart";
import { TripTimeline } from "@/components/trip-timeline";
import { progressByPhase } from "@/lib/task-metrics";
import type { Task } from "@/types/task";
import Link from "next/link";

export default async function DashboardPage() {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("target_date", { ascending: true, nullsFirst: false });

  if (error) {
    return (
      <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-6 text-red-200">
        <p className="font-medium">Could not load tasks</p>
        <p className="mt-2 text-sm">{error.message}</p>
        <p className="mt-4 text-sm text-slate-400">
          Run the SQL in <code className="text-slate-200">supabase/migrations/001_tasks.sql</code>{" "}
          in the Supabase SQL editor, then seed with{" "}
          <code className="text-slate-200">npm run seed</code>.
        </p>
      </div>
    );
  }

  const tasks = (data ?? []) as Task[];

  if (tasks.length === 0) {
    return (
      <div className="rounded-xl border border-surface-border bg-surface-card p-8 text-center">
        <h1 className="text-xl font-semibold text-white">No tasks yet</h1>
        <p className="mt-2 text-sm text-slate-400">
          Create the table, then import your checklist.
        </p>
        <ol className="mx-auto mt-6 max-w-md list-decimal space-y-2 text-left text-sm text-slate-300">
          <li>
            In Supabase → SQL → paste{" "}
            <code className="text-slate-100">supabase/migrations/001_tasks.sql</code>
          </li>
          <li>
            Add <code className="text-slate-100">.env.local</code> with URL, anon key, and
            service role key
          </li>
          <li>
            Run <code className="text-slate-100">npm run seed</code>
          </li>
        </ol>
        <Link
          href="/tasks"
          className="mt-6 inline-block text-sm text-accent-muted hover:text-white"
        >
          Open tasks anyway →
        </Link>
      </div>
    );
  }

  const chart = progressByPhase(tasks);

  return (
    <div className="space-y-10">
      <DashboardStats tasks={tasks} />
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 rounded-xl border border-surface-border bg-surface-card p-5">
          <h2 className="text-sm font-semibold text-white">Progress by phase</h2>
          <p className="mt-1 text-xs text-slate-500">
            Top phases by task count. Percent = share of tasks marked Done.
          </p>
          <div className="mt-4">
            <PhaseChart data={chart} />
          </div>
        </div>
        <TripTimeline />
      </div>
    </div>
  );
}
