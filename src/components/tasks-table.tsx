import type { Task } from "@/types/task";
import { DueBadge } from "@/components/due-badge";
import { TaskStatusSelect } from "@/components/task-status-select";

export function TasksTable({ tasks }: { tasks: Task[] }) {
  if (tasks.length === 0) {
    return (
      <p className="rounded-xl border border-dashed border-surface-border p-8 text-center text-slate-500">
        No tasks match these filters. Try clearing filters, or seed the database if
        this is a fresh project.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-surface-border bg-surface-card/40">
      <table className="min-w-full text-left text-sm">
        <thead className="bg-surface-card text-xs font-medium uppercase tracking-wide text-slate-500">
          <tr>
            <th className="whitespace-nowrap px-3 py-3">Due</th>
            <th className="whitespace-nowrap px-3 py-3">Priority</th>
            <th className="px-3 py-3">Task</th>
            <th className="whitespace-nowrap px-3 py-3">Section</th>
            <th className="whitespace-nowrap px-3 py-3">Phase</th>
            <th className="whitespace-nowrap px-3 py-3">Target</th>
            <th className="whitespace-nowrap px-3 py-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map((t) => (
            <tr
              key={t.id}
              className="border-t border-surface-border align-top hover:bg-surface/80"
            >
              <td className="whitespace-nowrap px-3 py-2">
                <DueBadge task={t} />
              </td>
              <td className="whitespace-nowrap px-3 py-2 text-slate-400">
                {t.priority ?? "—"}
              </td>
              <td className="px-3 py-2 text-slate-100">
                <span className="font-medium">{t.title}</span>
                {t.notes ? (
                  <p className="mt-1 text-xs text-slate-500 line-clamp-2">{t.notes}</p>
                ) : null}
              </td>
              <td className="whitespace-nowrap px-3 py-2 text-slate-400">
                {t.section ?? "—"}
              </td>
              <td className="max-w-[14rem] px-3 py-2 text-slate-400">
                <span className="line-clamp-2">{t.phase ?? "—"}</span>
              </td>
              <td className="whitespace-nowrap px-3 py-2 text-slate-400">
                {t.target_date ?? "—"}
              </td>
              <td className="whitespace-nowrap px-3 py-2">
                <TaskStatusSelect id={t.id} value={t.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
