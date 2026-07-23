"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X, TerminalSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ThemeToggle } from "@/components/layout/ThemeToggle";
import { ROUTES } from "@/lib/constants";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "FAQ", href: "#faq" },
];

export function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/70 bg-paper/80 backdrop-blur-md">
      <nav className="container-shell flex h-16 items-center justify-between">
        <Link href={ROUTES.home} className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-md bg-ink text-paper">
            <TerminalSquare className="size-4" />
          </span>
          <span className="font-display text-[15px] font-semibold tracking-tight text-ink">
            interview<span className="text-cobalt">.engine</span>
          </span>
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-ink-soft transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <Link href={ROUTES.login}>
            <Button variant="ghost" size="sm">
              Log in
            </Button>
          </Link>
          <Link href={ROUTES.signup}>
            <Button variant="cobalt" size="sm">
              Start practicing
            </Button>
          </Link>
        </div>

        <button
          className="flex size-9 items-center justify-center rounded-md text-ink md:hidden"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>
      </nav>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden border-t border-border md:hidden"
          >
            <div className="container-shell flex flex-col gap-4 py-5">
              {NAV_LINKS.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className="text-sm text-ink-soft"
                >
                  {link.label}
                </a>
              ))}
              <div className="flex items-center gap-3 pt-2">
                <ThemeToggle />
                <Link href={ROUTES.login} className="flex-1">
                  <Button variant="ghost" size="sm" className="w-full">
                    Log in
                  </Button>
                </Link>
                <Link href={ROUTES.signup} className="flex-1">
                  <Button variant="cobalt" size="sm" className="w-full">
                    Start practicing
                  </Button>
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
