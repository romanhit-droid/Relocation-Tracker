# Paphos relocation tracker

Next.js app with Supabase auth (magic link), shared task list, dashboard metrics, and filters for due dates and phases.

## Prerequisites

- Node.js 18+ and npm
- A Supabase project

## 1. Configure Supabase Auth

In **Authentication → URL configuration**:

- **Site URL:** `http://localhost:3000` (add your Vercel URL when you deploy)
- **Redirect URLs:** include `http://localhost:3000/**` and your production `https://.../**`

Enable **Email** under **Authentication → Providers**.

## 2. Create the database table

Open **SQL Editor** in Supabase, paste the contents of `supabase/migrations/001_tasks.sql`, and run it.

## 3. Environment variables

Copy `.env.example` to `.env.local` and fill in:

- **Project URL** and **anon public key** (Settings → API). These power the web app.
- **service_role** key (same page): **server-only**, used only for `npm run seed`. Never expose it in the browser or commit it.

## 4. Install and seed

The seed script reads **`.env.local`** from the project root (no need to `export` variables by hand).

```bash
cd paphos-relocation
npm install
npm run seed
npm run dev
```

Open [http://localhost:3000](http://localhost:3000), request a magic link, and sign in. Repeat for your partner’s email.

If the table already has rows, seeding aborts unless you run `FORCE_SEED=1 npm run seed` (creates duplicates—usually avoid).

## 5. Limit who can sign up (recommended)

In **Authentication → Providers → Email**, restrict signups if your project offers it, or treat the anon key as sensitive and avoid sharing the app URL publicly.

## 6. Deploy (optional)

Connect the repo to Vercel, set the same `NEXT_PUBLIC_*` variables, and add the production URL to Supabase redirect URLs.

## Project layout

- `src/app/dashboard` — KPI cards, phase chart, trip timeline
- `src/app/tasks` — full checklist with filters and status updates
- `data/paphos_relocation_checklists.json` — source data for `npm run seed`
