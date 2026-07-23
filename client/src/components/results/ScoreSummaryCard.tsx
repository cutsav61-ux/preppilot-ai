import { motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import type { OverallFeedback } from "@/types/interview";

const RECOMMENDATION_VARIANTS: Record<string, "cobalt" | "amber" | "coral" | "neutral"> = {
  "Strong Hire": "cobalt",
  Hire: "cobalt",
  "Lean Hire": "amber",
  "No Hire": "coral",
  "Insufficient Data": "neutral",
};

function getRecommendationVariant(recommendation: string) {
  const key = Object.keys(RECOMMENDATION_VARIANTS).find((k) => recommendation.startsWith(k));
  return key ? RECOMMENDATION_VARIANTS[key] : "neutral";
}

export function ScoreSummaryCard({ feedback }: { feedback: OverallFeedback }) {
  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-4 pt-8 text-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="flex size-28 items-center justify-center rounded-full border-4 border-cobalt-soft"
        >
          <span className="font-display text-4xl font-semibold text-ink">
            {feedback.overallScore}
          </span>
        </motion.div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
            Overall score
          </p>
          <Badge variant={getRecommendationVariant(feedback.hiringRecommendation)} className="mt-2">
            {feedback.hiringRecommendation}
          </Badge>
        </div>
        <p className="max-w-md text-sm leading-relaxed text-ink-soft">{feedback.summary}</p>
        <div className="flex w-full flex-col gap-2 border-t border-border pt-4 text-left sm:flex-row sm:justify-between">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
              Answer quality
            </p>
            <p className="font-display text-lg font-semibold text-ink">{feedback.answerQuality}/100</p>
          </div>
          <div className="sm:text-right">
            <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
              Company readiness
            </p>
            <p className="max-w-xs text-sm text-ink">{feedback.companyReadiness}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
