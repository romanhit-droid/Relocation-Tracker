"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLogin = pathname === "/login";

  if (isLogin) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="border-b border-surface-border bg-surface-card/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="font-semibold text-white">
              Paphos relocation
            </Link>
            <nav className="flex gap-4 text-sm text-slate-300">
              <Link
                href="/dashboard"
                className={
                  pathname === "/dashboard"
                    ? "text-accent-muted"
                    : "hover:text-white"
                }
              >
                Dashboard
              </Link>
              <Link
                href="/tasks"
                className={
                  pathname === "/tasks" ? "text-accent-muted" : "hover:text-white"
                }
              >
                Tasks
              </Link>
            </nav>
          </div>
          <a
            href="/auth/signout"
            className="text-sm text-slate-400 hover:text-white"
          >
            Sign out
          </a>
        </div>
      </header>
      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-8">{children}</main>
    </div>
  );
}
