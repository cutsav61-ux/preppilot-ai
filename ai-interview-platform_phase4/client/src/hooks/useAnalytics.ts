"use client";

import { useQuery } from "@tanstack/react-query";
import { analyticsApi } from "@/lib/api/analytics.api";

export function useScoreTrend(range: "30d" | "90d" | "all" = "30d") {
  return useQuery({
    queryKey: ["analytics", "score-trend", range],
    queryFn: () => analyticsApi.getScoreTrend(range),
    select: (data) => data.trend,
  });
}

export function useCategoryBreakdown() {
  return useQuery({
    queryKey: ["analytics", "category-breakdown"],
    queryFn: () => analyticsApi.getCategoryBreakdown(),
    select: (data) => data.breakdown,
  });
}
