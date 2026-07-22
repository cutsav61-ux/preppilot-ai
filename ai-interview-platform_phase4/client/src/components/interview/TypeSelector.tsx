"use client";

import { motion } from "framer-motion";
import { Code2, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import type { InterviewType } from "@/types/user";

const TYPES: { value: InterviewType; label: string; description: string; icon: typeof Code2 }[] = [
  {
    value: "technical",
    label: "Technical",
    description: "DSA, system design, core CS",
    icon: Code2,
  },
  {
    value: "hr",
    label: "HR / Behavioral",
    description: "Teamwork, conflict, motivation",
    icon: Users,
  },
];

export function TypeSelector({
  value,
  onChange,
}: {
  value?: InterviewType;
  onChange: (value: InterviewType) => void;
}) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {TYPES.map((type) => {
        const isSelected = value === type.value;
        return (
          <motion.button
            key={type.value}
            type="button"
            onClick={() => onChange(type.value)}
            whileTap={{ scale: 0.98 }}
            className={cn(
              "flex flex-col items-start gap-2 rounded-lg border p-4 text-left transition-colors",
              isSelected
                ? "border-cobalt bg-cobalt-soft"
                : "border-border bg-surface hover:border-cobalt/40",
            )}
          >
            <span
              className={cn(
                "flex size-9 items-center justify-center rounded-md",
                isSelected ? "bg-cobalt text-white" : "bg-ink/5 text-ink-soft",
              )}
            >
              <type.icon className="size-5" />
            </span>
            <div>
              <p className={cn("text-sm font-medium", isSelected ? "text-cobalt" : "text-ink")}>
                {type.label}
              </p>
              <p className="text-xs text-ink-soft">{type.description}</p>
            </div>
          </motion.button>
        );
      })}
    </div>
  );
}
