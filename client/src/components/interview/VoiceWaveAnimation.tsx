"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const BAR_COUNT = 5;

export function VoiceWaveAnimation({
  active,
  variant = "speaking",
  className,
}: {
  active: boolean;
  variant?: "speaking" | "recording";
  className?: string;
}) {
  const color = variant === "recording" ? "bg-coral" : "bg-cobalt";

  return (
    <div className={cn("flex h-6 items-center gap-1", className)} aria-hidden>
      {Array.from({ length: BAR_COUNT }).map((_, index) => (
        <motion.span
          key={index}
          className={cn("w-1 rounded-full", color)}
          animate={
            active
              ? { height: ["30%", "100%", "45%", "80%", "30%"] }
              : { height: "20%" }
          }
          transition={
            active
              ? {
                  duration: 0.9 + index * 0.08,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: index * 0.06,
                }
              : { duration: 0.2 }
          }
          style={{ height: "20%" }}
        />
      ))}
    </div>
  );
}
