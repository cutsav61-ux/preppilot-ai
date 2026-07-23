"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { Difficulty } from "@/types/user";

const DIFFICULTIES: { value: Difficulty; label: string; description: string }[] = [
  { value: "easy", label: "Easy", description: "Fundamentals" },
  { value: "medium", label: "Medium", description: "Applied reasoning" },
  { value: "hard", label: "Hard", description: "Deep trade-offs" },
];

export function DifficultySelector({
  value,
  onChange,
}: {
  value?: Difficulty;
  onChange: (value: Difficulty) => void;
}) {
  return (
    <div className="grid grid-cols-3 gap-3">
      {DIFFICULTIES.map((difficulty) => {
        const isSelected = value === difficulty.value;
        return (
          <motion.button
            key={difficulty.value}
            type="button"
            onClick={() => onChange(difficulty.value)}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "flex flex-col items-center gap-1 rounded-lg border py-3 text-center transition-colors",
              isSelected
                ? "border-cobalt bg-cobalt-soft text-cobalt"
                : "border-border bg-surface text-ink hover:border-cobalt/40",
            )}
          >
            <span className="text-sm font-medium">{difficulty.label}</span>
            <span className={cn("text-xs", isSelected ? "text-cobalt/80" : "text-ink-soft")}>
              {difficulty.description}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
