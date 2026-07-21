"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { TerminalSquare } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Avatar } from "@/components/ui/Avatar";
import { ROUTES } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";

/**
 * Phase 0 foundation. Wires the sidebar and a top bar together for every
 * (dashboard) route. Real user data replaces the placeholder name once
 * Phase 1 auth is live; avatar menu (logout, profile shortcut) is added
 * alongside it.
 */
export function DashboardShell({ children }: { children: ReactNode }) {
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar />
      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-6">
          <Link href={ROUTES.home} className="flex items-center gap-2 md:hidden">
            <span className="flex size-8 items-center justify-center rounded-md bg-ink text-paper">
              <TerminalSquare className="size-4" />
            </span>
          </Link>
          <div className="hidden md:block" />
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Avatar name={user?.name ?? "Student"} src={user?.avatarUrl} size="sm" />
          </div>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
