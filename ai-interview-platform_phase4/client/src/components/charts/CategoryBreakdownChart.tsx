"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { LayoutGrid } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import type { CategoryBreakdownPoint } from "@/lib/api/analytics.api";

export function CategoryBreakdownChart({ data = [] }: { data?: CategoryBreakdownPoint[] }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Topic-wise performance</CardTitle>
        <CardDescription>Average score by role/topic you've practiced.</CardDescription>
      </CardHeader>
      <CardContent>
        {data.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-md border border-dashed border-border py-12 text-center">
            <span className="flex size-10 items-center justify-center rounded-full bg-ink/5 text-ink-soft">
              <LayoutGrid className="size-5" />
            </span>
            <p className="text-sm text-ink">Nothing to break down yet.</p>
            <p className="max-w-[240px] text-xs text-ink-soft">
              Complete interviews across a few roles and this will show where you're strongest.
            </p>
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 8, right: 8, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--grid-line))" />
                <XAxis dataKey="topic" tick={{ fontSize: 11 }} stroke="hsl(var(--ink-soft))" />
                <YAxis domain={[0, 100]} tick={{ fontSize: 12 }} stroke="hsl(var(--ink-soft))" />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--surface))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="avgScore" fill="hsl(var(--cobalt))" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
