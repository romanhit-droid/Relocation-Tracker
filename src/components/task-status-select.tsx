"use client";

import { updateTaskStatus } from "@/app/actions/tasks";
import { STATUS_OPTIONS } from "@/types/task";

export function TaskStatusSelect({ id, value }: { id: string; value: string }) {
  return (
    <select
      value={STATUS_OPTIONS.includes(value as (typeof STATUS_OPTIONS)[number]) ? value : "Not started"}
      onChange={async (e) => {
        await updateTaskStatus(id, e.target.value);
      }}
      className="max-w-[11rem] rounded-md border border-surface-border bg-surface px-2 py-1 text-xs text-slate-100 outline-none ring-accent focus:ring-2"
    >
      {STATUS_OPTIONS.map((s) => (
        <option key={s} value={s}>
          {s}
        </option>
      ))}
    </select>
  );
}
