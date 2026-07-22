"use client";

import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { cn } from "@/lib/utils";
import { ROLE_OPTIONS } from "@/lib/validators/interview";

export function TopicSelector({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap gap-2">
        {ROLE_OPTIONS.map((role) => {
          const isSelected = value === role;
          return (
            <motion.button
              key={role}
              type="button"
              onClick={() => onChange(role)}
              whileTap={{ scale: 0.97 }}
              className={cn(
                "rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
                isSelected
                  ? "border-cobalt bg-cobalt-soft text-cobalt"
                  : "border-border bg-surface text-ink-soft hover:border-cobalt/40 hover:text-ink",
              )}
            >
              {role}
            </motion.button>
          );
        })}
      </div>
      <Input
        label="Or type your own"
        placeholder="e.g. Site Reliability Engineer"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        error={error}
      />
    </div>
  );
}
