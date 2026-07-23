"use client";

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { TrendingUp } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";

export interface ScoreTrendPoint {
  date: string;
  score: number;
}

interface ScoreTrendChartProps {
  data?: ScoreTrendPoint[];
  title?: string;
  description?: string;
  emptyMessage?: string;
}

/**
 * Phase 2 foundation, extended in Phase 5: fully wired to Recharts. Title/
 * description are overridable so the same component can power both the
 * per-interview "Score trend" and the aggregated "Monthly progress" chart
 * without duplicating this file — the defaults match the original Phase 2/4
 * copy exactly, so existing usage is unaffected.
 */
export function ScoreTrendChart({
  data = [],
  title = "Score trend",
  description = "How your average score moves over time.",
  emptyMessage = "Complete a couple of interviews and your score trend will show up here.",
}: ScoreTrendChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-md border border-dashed border-border py-12 text-center">
            <span className="flex size-10 items-center justify-center rounded-full bg-ink/5 text-ink-soft">
              <TrendingUp className="size-5" />
            </span>
            <p className="text-sm text-ink">Nothing to chart yet.</p>
            <p className="max-w-[240px] text-xs text-ink-soft">{emptyMessage}</p>
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--grid-line))" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="hsl(var(--ink-soft))" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="hsl(var(--ink-soft))" />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--surface))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="hsl(var(--cobalt))"
                  strokeWidth={2}
                  dot={{ r: 3 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
