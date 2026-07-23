"use client";

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { PieChart as PieChartIcon } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import type { TypeDistributionPoint } from "@/lib/api/analytics.api";

const COLORS = ["hsl(var(--cobalt))", "hsl(var(--amber))"];

export function TypeDistributionChart({ data = [] }: { data?: TypeDistributionPoint[] }) {
  const hasData = data.some((point) => point.count > 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interview mix</CardTitle>
        <CardDescription>Technical vs HR sessions.</CardDescription>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex flex-col items-center gap-3 rounded-md border border-dashed border-border py-12 text-center">
            <span className="flex size-10 items-center justify-center rounded-full bg-ink/5 text-ink-soft">
              <PieChartIcon className="size-5" />
            </span>
            <p className="text-sm text-ink">No interviews yet.</p>
            <p className="max-w-[220px] text-xs text-ink-soft">
              This will show the split between technical and HR practice once you've done a few.
            </p>
          </div>
        ) : (
          <div className="h-56 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey="count"
                  nameKey="type"
                  innerRadius={50}
                  outerRadius={80}
                  paddingAngle={3}
                >
                  {data.map((entry, index) => (
                    <Cell key={entry.type} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--surface))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
