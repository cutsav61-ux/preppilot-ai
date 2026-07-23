"use client";

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { Scale } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import type { SkillAverages } from "@/lib/api/analytics.api";

export function SkillAveragesChart({ skills }: { skills?: SkillAverages }) {
  const hasData = skills && Object.values(skills).some((value) => value > 0);

  const data = skills
    ? [
        { skill: "Communication", value: skills.communication },
        { skill: "Technical", value: skills.technical },
        { skill: "Problem Solving", value: skills.problemSolving },
        { skill: "Confidence", value: skills.confidence },
      ]
    : [];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Skill comparison</CardTitle>
        <CardDescription>Your average across every rated dimension.</CardDescription>
      </CardHeader>
      <CardContent>
        {!hasData ? (
          <div className="flex flex-col items-center gap-3 rounded-md border border-dashed border-border py-12 text-center">
            <span className="flex size-10 items-center justify-center rounded-full bg-ink/5 text-ink-soft">
              <Scale className="size-5" />
            </span>
            <p className="text-sm text-ink">Nothing to compare yet.</p>
            <p className="max-w-[240px] text-xs text-ink-soft">
              Complete an interview and your skill breakdown shows up here.
            </p>
          </div>
        ) : (
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} layout="vertical" margin={{ top: 8, right: 24, left: 0, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--grid-line))" horizontal={false} />
                <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} stroke="hsl(var(--ink-soft))" />
                <YAxis
                  type="category"
                  dataKey="skill"
                  width={100}
                  tick={{ fontSize: 12 }}
                  stroke="hsl(var(--ink-soft))"
                />
                <Tooltip
                  contentStyle={{
                    background: "hsl(var(--surface))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: 8,
                    fontSize: 12,
                  }}
                />
                <Bar dataKey="value" fill="hsl(var(--amber))" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
