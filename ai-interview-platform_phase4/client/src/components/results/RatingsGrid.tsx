import { MessageSquare, Cpu, Puzzle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { OverallFeedback } from "@/types/interview";

export function RatingsGrid({ feedback }: { feedback: OverallFeedback }) {
  const ratings = [
    { label: "Communication", value: feedback.communicationScore, icon: MessageSquare },
    { label: "Technical", value: feedback.technicalScore, icon: Cpu },
    { label: "Problem-solving", value: feedback.problemSolvingScore, icon: Puzzle },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
      {ratings.map((rating) => (
        <Card key={rating.label} className="p-4">
          <div className="flex items-center gap-2">
            <rating.icon className="size-4 text-cobalt" />
            <span className="text-xs font-medium uppercase tracking-wide text-ink-soft">
              {rating.label}
            </span>
          </div>
          <p className="mt-2 font-display text-xl font-semibold text-ink">{rating.value}</p>
          <ProgressBar value={rating.value} className="mt-2" />
        </Card>
      ))}
    </div>
  );
}
