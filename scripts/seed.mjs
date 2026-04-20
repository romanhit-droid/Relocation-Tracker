/**
 * One-time import of checklist rows into Supabase.
 * Requires SUPABASE_SERVICE_ROLE_KEY (server only — never expose to the browser).
 *
 * Loads variables from .env.local in the project root (same as Next.js).
 */

import { createClient } from "@supabase/supabase-js";
import { config as loadEnv } from "dotenv";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
loadEnv({ path: path.join(__dirname, "..", ".env.local") });

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !serviceKey) {
  console.error(
    "Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in the environment.",
  );
  console.error("Load them from .env.local before running npm run seed.");
  process.exit(1);
}

const jsonPath = path.join(__dirname, "..", "data", "paphos_relocation_checklists.json");
const raw = fs.readFileSync(jsonPath, "utf8");
const { tasks } = JSON.parse(raw);

const supabase = createClient(url, serviceKey);

const { count, error: countError } = await supabase
  .from("tasks")
  .select("*", { count: "exact", head: true });

if (countError) {
  console.error("Could not read tasks table:", countError.message);
  console.error("Apply supabase/migrations/001_tasks.sql in the Supabase SQL editor first.");
  process.exit(1);
}

if (count && count > 0 && process.env.FORCE_SEED !== "1") {
  console.error(
    `Table already has ${count} rows. Set FORCE_SEED=1 to insert anyway (duplicates tasks).`,
  );
  process.exit(1);
}

const rows = tasks.map((t) => ({
  section: t.Section,
  phase: t.Phase,
  title: t.Task,
  owner: t.Owner,
  target_date: t["Target date"] || null,
  status: t.Status || "Not started",
  priority: t.Priority,
  notes: t["Notes / Vendor / Contact"],
}));

const batchSize = 80;
for (let i = 0; i < rows.length; i += batchSize) {
  const chunk = rows.slice(i, i + batchSize);
  const { error } = await supabase.from("tasks").insert(chunk);
  if (error) {
    console.error("Insert failed:", error.message);
    process.exit(1);
  }
  console.log(`Inserted ${Math.min(i + batchSize, rows.length)} / ${rows.length}`);
}

console.log("Done.");
