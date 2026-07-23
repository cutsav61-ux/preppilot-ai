import { Timer } from "lucide-react";
import { cn } from "@/lib/utils";
import { formatSeconds } from "@/hooks/useStopwatch";

export function CountdownTimer({ remainingSeconds }: { remainingSeconds: number }) {
  const isLow = remainingSeconds <= 15;

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-full border px-3 py-1.5 font-mono text-xs",
        isLow ? "border-coral bg-coral-soft text-coral" : "border-border bg-surface text-ink-soft",
      )}
    >
      <Timer className="size-3.5" />
      {formatSeconds(remainingSeconds)} left
    </div>
  );
}
