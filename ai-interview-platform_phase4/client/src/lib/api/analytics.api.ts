import { apiClient } from "@/lib/apiClient";

export interface AnalyticsOverview {
  totalInterviews: number;
  avgScore: number;
  currentStreak: number;
  lastInterviewAt: string | null;
}

export interface ScoreTrendPoint {
  date: string;
  score: number;
}

export interface CategoryBreakdownPoint {
  topic: string;
  avgScore: number;
  count: number;
}

export const analyticsApi = {
  getOverview: () => apiClient.get<AnalyticsOverview>("/analytics/overview"),

  getScoreTrend: (range: "30d" | "90d" | "all" = "30d") =>
    apiClient.get<{ trend: ScoreTrendPoint[] }>(`/analytics/score-trend?range=${range}`),

  getCategoryBreakdown: () =>
    apiClient.get<{ breakdown: CategoryBreakdownPoint[] }>("/analytics/category-breakdown"),
};
