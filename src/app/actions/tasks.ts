"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateTaskStatus(id: string, status: string) {
  const supabase = await createClient();
  const { error } = await supabase.from("tasks").update({ status }).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/tasks");
  revalidatePath("/dashboard");
}

export async function updateTaskFields(
  id: string,
  fields: {
    owner?: string | null;
    target_date?: string | null;
    notes?: string | null;
  },
) {
  const supabase = await createClient();
  const { error } = await supabase.from("tasks").update(fields).eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePath("/tasks");
  revalidatePath("/dashboard");
}
