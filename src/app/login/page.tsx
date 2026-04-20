import { LoginForm } from "@/components/login-form";

export default function LoginPage({
  searchParams,
}: {
  searchParams: { error?: string };
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4">
      <div className="w-full max-w-md rounded-xl border border-surface-border bg-surface-card p-8 shadow-xl">
        <h1 className="text-xl font-semibold text-white">Sign in</h1>
        <p className="mt-2 text-sm text-slate-400">
          We&apos;ll email you a magic link. Use the same Supabase project for both
          accounts.
        </p>
        {searchParams.error === "auth" && (
          <p className="mt-4 rounded-lg bg-red-950/50 px-3 py-2 text-sm text-red-200">
            Sign-in failed. Try again or check Supabase Auth settings and redirect
            URLs.
          </p>
        )}
        <div className="mt-6">
          <LoginForm />
        </div>
      </div>
    </div>
  );
}
