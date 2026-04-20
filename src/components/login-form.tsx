"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent" | "error">(
    "idle",
  );
  const [message, setMessage] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("loading");
    setMessage(null);
    const supabase = createClient();
    const origin = window.location.origin;
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim(),
      options: {
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });
    if (error) {
      setStatus("error");
      setMessage(error.message);
      return;
    }
    setStatus("sent");
    setMessage("Check your email for the magic link.");
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col gap-4">
      <label className="block text-sm text-slate-300">
        Email
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 w-full rounded-lg border border-surface-border bg-surface px-3 py-2 text-white outline-none ring-accent focus:ring-2"
          placeholder="you@example.com"
          autoComplete="email"
        />
      </label>
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-white hover:bg-blue-600 disabled:opacity-50"
      >
        {status === "loading" ? "Sending…" : "Send magic link"}
      </button>
      {message && (
        <p
          className={
            status === "error" ? "text-sm text-red-300" : "text-sm text-emerald-300"
          }
        >
          {message}
        </p>
      )}
    </form>
  );
}
