import { ThumbsUp, TrendingUp, BookOpen, ListChecks } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import type { OverallFeedback } from "@/types/interview";

function ListCard({
  title,
  icon: Icon,
  items,
  variant,
  emptyLabel,
}: {
  title: string;
  icon: typeof ThumbsUp;
  items: string[];
  variant: "cobalt" | "amber" | "coral";
  emptyLabel: string;
}) {
  return (
    <Card className="p-5">
      <div className="flex items-center gap-2">
        <Icon className="size-4 text-cobalt" />
        <h3 className="text-sm font-medium text-ink">{title}</h3>
      </div>
      {items.length === 0 ? (
        <p className="mt-3 text-xs text-ink-soft">{emptyLabel}</p>
      ) : (
        <ul className="mt-3 flex flex-col gap-2">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm text-ink-soft">
              <Badge variant={variant} className="mt-0.5 shrink-0">
                •
              </Badge>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </Card>
  );
}

export function ImprovementRoadmap({ feedback }: { feedback: OverallFeedback }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Improvement roadmap</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ListCard
          title="Strengths"
          icon={ThumbsUp}
          items={feedback.topStrengths}
          variant="cobalt"
          emptyLabel="No standout strengths flagged this time."
        />
        <ListCard
          title="Areas to improve"
          icon={TrendingUp}
          items={feedback.topImprovements}
          variant="coral"
          emptyLabel="No major gaps flagged this time."
        />
        <ListCard
          title="Study next"
          icon={BookOpen}
          items={feedback.recommendedTopics}
          variant="amber"
          emptyLabel="No specific topics recommended."
        />
        <ListCard
          title="Study plan"
          icon={ListChecks}
          items={feedback.studyPlan}
          variant="cobalt"
          emptyLabel="No specific action plan generated."
        />
      </CardContent>
    </Card>
  );
}
