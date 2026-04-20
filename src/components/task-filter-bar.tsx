"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import type { TaskSearchParams } from "@/lib/filter-tasks";

function parseSp(searchParams: URLSearchParams): TaskSearchParams {
  return {
    q: searchParams.get("q") ?? undefined,
    phase: searchParams.get("phase") ?? undefined,
    section: searchParams.get("section") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    due: searchParams.get("due") ?? undefined,
  };
}

function buildQuery(sp: TaskSearchParams, patch: Partial<TaskSearchParams>) {
  const merged: TaskSearchParams = { ...sp, ...patch };
  (Object.keys(patch) as (keyof TaskSearchParams)[]).forEach((k) => {
    if (patch[k] === undefined) delete merged[k];
  });
  const u = new URLSearchParams();
  (Object.entries(merged) as [keyof TaskSearchParams, string | undefined][]).forEach(
    ([k, v]) => {
      if (v && v !== "all") u.set(k, v);
    },
  );
  const qs = u.toString();
  return qs ? `/tasks?${qs}` : "/tasks";
}

const chip =
  "inline-flex items-center rounded-full border border-surface-border px-3 py-1 text-xs text-slate-300 hover:border-accent hover:text-white";
const chipActive = "border-accent bg-accent/10 text-white";

export function TaskFilterBar({
  phases,
  sections,
}: {
  phases: string[];
  sections: string[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sp = useMemo(() => parseSp(searchParams), [searchParams]);

  function go(patch: Partial<TaskSearchParams>) {
    router.push(buildQuery(sp, patch));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        <span className="mr-2 text-xs uppercase text-slate-500">Due</span>
        {(
          [
            ["all", "All", { due: undefined }],
            ["overdue", "Overdue", { due: "overdue" }],
            ["7", "≤7 days", { due: "7" }],
            ["30", "≤30 days", { due: "30" }],
            ["none", "No date", { due: "none" }],
            ["risk", "At risk", { due: "risk" }],
          ] as const
        ).map(([id, label, patch]) => {
          const active =
            (id === "all" && (!sp.due || sp.due === "all")) || sp.due === id;
          return (
            <Link
              key={id}
              href={buildQuery(sp, patch)}
              className={active ? `${chip} ${chipActive}` : chip}
            >
              {label}
            </Link>
          );
        })}
      </div>

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <label className="block text-xs text-slate-400">
          Section
          <select
            className="mt-1 w-full rounded-lg border border-surface-border bg-surface px-2 py-2 text-sm text-slate-100"
            value={sp.section ?? ""}
            onChange={(e) =>
              go({ section: e.target.value || undefined })
            }
          >
            <option value="">All</option>
            {sections.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs text-slate-400">
          Phase
          <select
            className="mt-1 w-full rounded-lg border border-surface-border bg-surface px-2 py-2 text-sm text-slate-100"
            value={sp.phase ?? ""}
            onChange={(e) => go({ phase: e.target.value || undefined })}
          >
            <option value="">All</option>
            {phases.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-xs text-slate-400">
          Status
          <select
            className="mt-1 w-full rounded-lg border border-surface-border bg-surface px-2 py-2 text-sm text-slate-100"
            value={sp.status ?? ""}
            onChange={(e) => go({ status: e.target.value || undefined })}
          >
            <option value="">All</option>
            <option value="Not started">Not started</option>
            <option value="In progress">In progress</option>
            <option value="Blocked">Blocked</option>
            <option value="Done">Done</option>
          </select>
        </label>
        <form
          className="text-xs text-slate-400"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            const q = String(fd.get("q") ?? "").trim();
            go({ q: q || undefined });
          }}
        >
          <span className="block">Search</span>
          <div className="mt-1 flex gap-2">
            <input
              name="q"
              defaultValue={sp.q ?? ""}
              placeholder="Title or notes"
              className="w-full rounded-lg border border-surface-border bg-surface px-2 py-2 text-sm text-slate-100"
            />
            <button
              type="submit"
              className="rounded-lg bg-surface-border px-3 py-2 text-sm text-white hover:bg-slate-600"
            >
              Go
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
