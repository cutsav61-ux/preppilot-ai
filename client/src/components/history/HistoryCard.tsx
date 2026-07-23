import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { Interview } from "@/types/interview";

const STATUS_VARIANT = {
  completed: "cobalt",
  in_progress: "amber",
  abandoned: "coral",
} as const;

const STATUS_LABEL = {
  completed: "Completed",
  in_progress: "In progress",
  abandoned: "Abandoned",
} as const;

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function HistoryCard({ interview }: { interview: Interview }) {
  return (
    <Link href={`/interview/${interview.id}`}>
      <Card className="flex items-center justify-between gap-4 p-4 transition-colors hover:border-cobalt/40 hover:bg-cobalt-soft/20">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium text-ink">
              {interview.topic}
              {interview.company && (
                <span className="font-normal text-ink-soft"> · {interview.company}</span>
              )}
            </p>
            <Badge variant={STATUS_VARIANT[interview.status]}>{STATUS_LABEL[interview.status]}</Badge>
          </div>
          <div className="mt-1.5 flex flex-wrap items-center gap-1.5">
            <Badge variant="neutral">{interview.type === "technical" ? "Technical" : "HR"}</Badge>
            <Badge variant="neutral">{interview.difficulty}</Badge>
            <span className="text-xs text-ink-soft">{formatDate(interview.startedAt)}</span>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-4">
          {interview.overallFeedback && (
            <div className="text-right">
              <p className="font-display text-lg font-semibold text-ink">
                {interview.overallFeedback.overallScore}
              </p>
              <p className="text-xs text-ink-soft">score</p>
            </div>
          )}
          <ArrowUpRight className="size-4 text-ink-soft" />
        </div>
      </Card>
    </Link>
  );
}
