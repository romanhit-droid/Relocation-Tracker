import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import {
  filterTasks,
  uniqueStrings,
  type TaskSearchParams,
} from "@/lib/filter-tasks";
import { TaskFilterBar } from "@/components/task-filter-bar";
import { TasksTable } from "@/components/tasks-table";
import type { Task } from "@/types/task";

export default async function TasksPage({
  searchParams,
}: {
  searchParams: TaskSearchParams;
}) {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("tasks")
    .select("*")
    .order("phase", { ascending: true })
    .order("title", { ascending: true });

  if (error) {
    return (
      <div className="rounded-xl border border-red-900/50 bg-red-950/30 p-6 text-red-200">
        <p className="font-medium">Could not load tasks</p>
        <p className="mt-2 text-sm">{error.message}</p>
      </div>
    );
  }

  const all = (data ?? []) as Task[];
  const phases = uniqueStrings(all.map((t) => t.phase));
  const sections = uniqueStrings(all.map((t) => t.section));
  const filtered = filterTasks(all, searchParams);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Tasks</h1>
        <p className="text-sm text-slate-400">
          {filtered.length} shown · {all.length} total
        </p>
      </div>

      <Suspense
        fallback={
          <div className="text-sm text-slate-500">Loading filters…</div>
        }
      >
        <TaskFilterBar phases={phases} sections={sections} />
      </Suspense>

      <TasksTable tasks={filtered} />
    </div>
  );
}
