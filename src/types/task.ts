export type Task = {
  id: string;
  section: string | null;
  phase: string | null;
  title: string;
  owner: string | null;
  target_date: string | null;
  status: string;
  priority: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

export const STATUS_OPTIONS = [
  "Not started",
  "In progress",
  "Blocked",
  "Done",
] as const;
