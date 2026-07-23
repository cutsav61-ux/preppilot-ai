import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { ProgressBar } from "@/components/ui/ProgressBar";
import type { DifficultyDistributionPoint } from "@/lib/api/analytics.api";

export function DifficultyBreakdownCard({ data = [] }: { data?: DifficultyDistributionPoint[] }) {
  const total = data.reduce((sum, point) => sum + point.count, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interview distribution</CardTitle>
        <CardDescription>By difficulty, across all sessions.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {total === 0 ? (
          <p className="text-sm text-ink-soft">No interviews yet.</p>
        ) : (
          data.map((point) => (
            <div key={point.difficulty}>
              <div className="mb-1.5 flex items-center justify-between text-sm">
                <span className="text-ink">{point.difficulty}</span>
                <span className="text-ink-soft">{point.count}</span>
              </div>
              <ProgressBar value={point.count} max={total} />
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
