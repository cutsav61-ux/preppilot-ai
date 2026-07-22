"use client";

import { motion } from "framer-motion";
import { Flame } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { cn } from "@/lib/utils";

const DAYS = ["M", "T", "W", "T", "F", "S", "S"];

export function StreakWidget({ currentStreak }: { currentStreak: number }) {
  const filledDays = Math.min(currentStreak, 7);

  return (
    <Card className="flex flex-col gap-4 p-5">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
            This week's streak
          </p>
          <p className="mt-1 font-display text-2xl font-semibold text-ink">
            {currentStreak} {currentStreak === 1 ? "day" : "days"}
          </p>
        </div>
        <span className="flex size-10 items-center justify-center rounded-full bg-amber-soft text-amber">
          <Flame className="size-5" />
        </span>
      </div>

      <div className="flex items-center justify-between gap-1.5">
        {DAYS.map((day, index) => {
          const isFilled = index < filledDays;
          return (
            <div key={index} className="flex flex-1 flex-col items-center gap-1.5">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: index * 0.05, duration: 0.25 }}
                className={cn(
                  "flex size-8 items-center justify-center rounded-full border text-xs font-medium",
                  isFilled
                    ? "border-amber bg-amber-soft text-amber"
                    : "border-border text-ink-soft/50",
                )}
              >
                {isFilled ? <Flame className="size-3.5" /> : day}
              </motion.div>
            </div>
          );
        })}
      </div>

      <p className="text-xs text-ink-soft">
        {currentStreak === 0
          ? "Complete an interview to start your streak."
          : "Come back tomorrow to keep it alive."}
      </p>
    </Card>
  );
}
