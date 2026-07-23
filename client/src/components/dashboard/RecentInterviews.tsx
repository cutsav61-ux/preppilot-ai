"use client";

import Link from "next/link";
import { FileStack, ArrowUpRight } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { useRecentInterviews } from "@/hooks/useInterview";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

export function RecentInterviews() {
  const { data: interviews, isLoading } = useRecentInterviews(5);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent interviews</CardTitle>
        <CardDescription>Your last few sessions.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="h-14 w-full rounded-md" />
            ))}
          </div>
        ) : !interviews || interviews.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-md border border-dashed border-border py-10 text-center">
            <span className="flex size-10 items-center justify-center rounded-full bg-ink/5 text-ink-soft">
              <FileStack className="size-5" />
            </span>
            <p className="text-sm text-ink">No interviews yet.</p>
            <p className="max-w-[220px] text-xs text-ink-soft">
              Start a mock interview above and it'll show up here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {interviews.map((interview) => (
              <Link
                key={interview.id}
                href={`/interview/${interview.id}`}
                className="flex items-center justify-between rounded-md border border-border p-3 transition-colors hover:border-cobalt/40 hover:bg-cobalt-soft/30"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-ink">{interview.topic}</p>
                  <div className="mt-1 flex items-center gap-1.5">
                    <Badge variant="neutral">{interview.type === "technical" ? "Technical" : "HR"}</Badge>
                    <Badge variant="amber">{interview.difficulty}</Badge>
                    <span className="text-xs text-ink-soft">{formatDate(interview.startedAt)}</span>
                  </div>
                </div>
                <ArrowUpRight className="size-4 shrink-0 text-ink-soft" />
              </Link>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
