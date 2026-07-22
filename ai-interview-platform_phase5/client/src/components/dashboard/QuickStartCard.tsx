"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { PlusCircle, History, UserCog } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { ROUTES } from "@/lib/constants";
import { cn } from "@/lib/utils";

const ACTIONS = [
  {
    label: "Start a mock interview",
    description: "Technical or HR, your call",
    icon: PlusCircle,
    href: ROUTES.interviewNew,
    comingSoon: false,
  },
  {
    label: "View interview history",
    description: "Revisit past feedback",
    icon: History,
    href: ROUTES.history,
    comingSoon: false,
  },
  {
    label: "Edit your profile",
    description: "Keep your target role current",
    icon: UserCog,
    href: ROUTES.profile,
    comingSoon: false,
  },
];

export function QuickStartCard() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick actions</CardTitle>
        <CardDescription>Jump to what you need.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-3 sm:grid-cols-3">
        {ACTIONS.map(({ label, description, icon: Icon, href, comingSoon }) => {
          const tile = (
            <div
              className={cn(
                "flex h-full flex-col gap-2 rounded-md border border-border p-4 transition-colors",
                comingSoon ? "cursor-not-allowed opacity-60" : "hover:border-cobalt/40 hover:bg-cobalt-soft/40",
              )}
            >
              <div className="flex items-center justify-between">
                <span className="flex size-8 items-center justify-center rounded-md bg-cobalt-soft text-cobalt">
                  <Icon className="size-4" />
                </span>
                {comingSoon && (
                  <span className="rounded-full border border-border px-1.5 py-0.5 font-mono text-[10px] text-ink-soft">
                    Soon
                  </span>
                )}
              </div>
              <div>
                <p className="text-sm font-medium text-ink">{label}</p>
                <p className="text-xs text-ink-soft">{description}</p>
              </div>
            </div>
          );

          if (comingSoon) {
            return (
              <div key={label} aria-disabled title={`${label} — coming soon`}>
                {tile}
              </div>
            );
          }

          return (
            <motion.div key={label} whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
              <Link href={href}>{tile}</Link>
            </motion.div>
          );
        })}
      </CardContent>
    </Card>
  );
}
