"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "framer-motion";
import { X, LogOut, TerminalSquare } from "lucide-react";
import { cn } from "@/lib/utils";
import { NAV_ITEMS } from "@/components/layout/navItems";
import { Avatar } from "@/components/ui/Avatar";
import { useAuth } from "@/hooks/useAuth";
import { ROUTES } from "@/lib/constants";

export function MobileSidebar({ open, onClose }: { open: boolean; onClose: () => void }) {
  const pathname = usePathname();
  const { user, logout, isLoggingOut } = useAuth();

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <motion.div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            aria-hidden
          />
          <motion.aside
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 320, damping: 34 }}
            className="relative flex h-full w-72 flex-col border-r border-border bg-surface p-4"
          >
            <div className="flex items-center justify-between">
              <Link href={ROUTES.home} className="flex items-center gap-2" onClick={onClose}>
                <span className="flex size-8 items-center justify-center rounded-md bg-ink text-paper">
                  <TerminalSquare className="size-4" />
                </span>
                <span className="font-display text-[15px] font-semibold tracking-tight text-ink">
                  interview<span className="text-cobalt">.engine</span>
                </span>
              </Link>
              <button
                onClick={onClose}
                aria-label="Close menu"
                className="flex size-8 items-center justify-center rounded-md text-ink-soft hover:text-ink"
              >
                <X className="size-4" />
              </button>
            </div>

            <nav className="mt-6 flex flex-1 flex-col gap-1">
              {NAV_ITEMS.map(({ label, href, icon: Icon, comingSoon }) => {
                const isActive = pathname === href;

                if (comingSoon) {
                  return (
                    <div
                      key={href}
                      className="flex items-center justify-between rounded-md px-3 py-2.5 text-sm font-medium text-ink-soft/50"
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
                  <Link
                    key={href}
                    href={href}
                    onClick={onClose}
                    className={cn(
                      "flex items-center gap-2.5 rounded-md px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive ? "bg-cobalt-soft text-cobalt" : "text-ink-soft hover:bg-ink/5 hover:text-ink",
                    )}
                  >
                    <Icon className="size-4" />
                    {label}
                  </Link>
                );
              })}
            </nav>

            <div className="flex items-center gap-2.5 border-t border-border pt-4">
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
          </motion.aside>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}
