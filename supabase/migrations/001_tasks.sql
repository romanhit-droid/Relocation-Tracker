-- Run this in Supabase SQL Editor (or via CLI) before using the app.

create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  section text,
  phase text,
  title text not null,
  owner text,
  target_date date,
  status text not null default 'Not started',
  priority text,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists tasks_target_date_idx on public.tasks (target_date);
create index if not exists tasks_phase_idx on public.tasks (phase);
create index if not exists tasks_status_idx on public.tasks (status);
create index if not exists tasks_section_idx on public.tasks (section);

create or replace function public.set_tasks_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists tasks_updated_at on public.tasks;
create trigger tasks_updated_at
before update on public.tasks
for each row execute function public.set_tasks_updated_at();

alter table public.tasks enable row level security;

drop policy if exists "tasks_select_auth" on public.tasks;
drop policy if exists "tasks_insert_auth" on public.tasks;
drop policy if exists "tasks_update_auth" on public.tasks;
drop policy if exists "tasks_delete_auth" on public.tasks;

create policy "tasks_select_auth"
  on public.tasks for select
  to authenticated
  using (true);

create policy "tasks_insert_auth"
  on public.tasks for insert
  to authenticated
  with check (true);

create policy "tasks_update_auth"
  on public.tasks for update
  to authenticated
  using (true)
  with check (true);

create policy "tasks_delete_auth"
  on public.tasks for delete
  to authenticated
  using (true);
