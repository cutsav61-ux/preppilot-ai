import { Clock } from "lucide-react";
import { formatSeconds } from "@/hooks/useStopwatch";

export function InterviewTimer({ elapsedSeconds }: { elapsedSeconds: number }) {
  return (
    <div className="flex items-center gap-1.5 rounded-full border border-border bg-surface px-3 py-1.5 font-mono text-xs text-ink-soft">
      <Clock className="size-3.5" />
      {formatSeconds(elapsedSeconds)}
    </div>
  );
}
