"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/components/layout/navItems";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/hooks/useAuth";

/**
 * Full Phase 2 implementation: active-tab indicator animates between items
 * with a shared layoutId, not-yet-built routes are visibly disabled with a
 * "Soon" badge instead of dead-ending in a 404, and a mini profile + log
 * out sits pinned to the bottom.
 */
export function Sidebar() {
  const pathname = usePathname();
  const { user, logout, isLoggingOut } = useAuth();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-surface p-4 md:flex">
      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ label, href, icon: Icon, comingSoon }) => {
          const isActive = pathname === href;

          if (comingSoon) {
            return (
              <div
                key={href}
                className="flex cursor-not-allowed items-center justify-between rounded-md px-3 py-2 text-sm font-medium text-ink-soft/50"
                title={`${label} — coming soon`}
              >
                <span className="flex items-center gap-2.5">
                  <Icon className="size-4" />
                  {label}
                </span>
                <span className="rounded-full border border-border px-1.5 py-0.5 font-mono text-[10px] text-ink-soft/60">
                  Soon
                </span>
              </div>
            );
          }

          return (
            <Link key={href} href={href} className="relative">
              {isActive && (
                <motion.span
                  layoutId="sidebar-active-pill"
                  className="absolute inset-0 rounded-md bg-cobalt-soft"
                  transition={{ type: "spring", stiffness: 400, damping: 32 }}
                />
              )}
              <span
                className={cn(
                  "relative flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive ? "text-cobalt" : "text-ink-soft hover:text-ink",
                )}
              >
                <Icon className="size-4" />
                {label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 flex items-center gap-2.5 border-t border-border pt-4">
        <Avatar name={user?.name ?? "Student"} src={user?.avatarUrl} size="sm" />
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-medium text-ink">{user?.name ?? "Student"}</p>
          <p className="truncate text-xs text-ink-soft">{user?.email}</p>
        </div>
        <button
          onClick={() => logout()}
          disabled={isLoggingOut}
          aria-label="Log out"
          className="flex size-8 shrink-0 items-center justify-center rounded-md text-ink-soft transition-colors hover:bg-coral-soft hover:text-coral disabled:opacity-50"
        >
          <LogOut className="size-4" />
        </button>
      </div>
    </aside>
  );
}
