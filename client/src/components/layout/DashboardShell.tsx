"use client";

import { useState, type ReactNode } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Menu, User, LogOut } from "lucide-react";
import { Sidebar } from "@/components/layout/Sidebar";
import { MobileSidebar } from "@/components/layout/MobileSidebar";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { Avatar } from "@/components/ui/Avatar";
import { Dropdown } from "@/components/ui/Dropdown";
import { NAV_ITEMS } from "@/components/layout/navItems";
import { ROUTES } from "@/lib/constants";
import { useAuth } from "@/hooks/useAuth";

export function DashboardShell({ children }: { children: ReactNode }) {
  const { user, logout } = useAuth();
  const pathname = usePathname();
  const router = useRouter();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const pageTitle = NAV_ITEMS.find((item) => item.href === pathname)?.label ?? "Dashboard";

  return (
    <div className="flex min-h-screen bg-paper">
      <Sidebar />
      <MobileSidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />

      <div className="flex flex-1 flex-col">
        <header className="flex h-16 items-center justify-between border-b border-border bg-surface px-4 md:px-6">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open menu"
              className="flex size-9 items-center justify-center rounded-md text-ink md:hidden"
            >
              <Menu className="size-5" />
            </button>
            <h1 className="font-display text-base font-medium text-ink md:text-lg">{pageTitle}</h1>
          </div>

          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Dropdown
              trigger={
                <button className="rounded-full transition-opacity hover:opacity-80">
                  <Avatar name={user?.name ?? "Student"} src={user?.avatarUrl} size="sm" />
                </button>
              }
              items={[
                {
                  label: "Profile",
                  icon: <User className="size-4" />,
                  onSelect: () => router.push(ROUTES.profile),
                },
                {
                  label: "Log out",
                  icon: <LogOut className="size-4" />,
                  destructive: true,
                  onSelect: () => logout(),
                },
              ]}
            />
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
