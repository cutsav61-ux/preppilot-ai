"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, History, User, Settings, PlusCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { ROUTES } from "@/lib/constants";

const NAV_ITEMS = [
  { label: "Dashboard", href: ROUTES.dashboard, icon: LayoutDashboard },
  { label: "New interview", href: ROUTES.interviewNew, icon: PlusCircle },
  { label: "History", href: ROUTES.history, icon: History },
  { label: "Profile", href: ROUTES.profile, icon: User },
  { label: "Settings", href: ROUTES.settings, icon: Settings },
];

/**
 * Phase 0 foundation. Fully assembled into DashboardShell with real active-
 * state routing polish, collapsible behavior, and responsive drawer in
 * Phase 3.
 */
export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-60 shrink-0 flex-col border-r border-border bg-surface p-4 md:flex">
      <nav className="flex flex-1 flex-col gap-1">
        {NAV_ITEMS.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href;
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                isActive ? "bg-cobalt-soft text-cobalt" : "text-ink-soft hover:bg-ink/5 hover:text-ink",
              )}
            >
              <Icon className="size-4" />
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
