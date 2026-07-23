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

export interface SkillAverages {
  communication: number;
  technical: number;
  problemSolving: number;
  confidence: number;
}

export interface MonthlyProgressPoint {
  month: string;
  avgScore: number;
}

export interface WeeklyProgressPoint {
  week: string;
  avgScore: number;
}

export interface TypeDistributionPoint {
  type: string;
  count: number;
}

export interface DifficultyDistributionPoint {
  difficulty: string;
  count: number;
}

export interface AnalyticsSummary {
  totalInterviews: number;
  avgScore: number;
  currentStreak: number;
  highestScore: number;
  lowestScore: number;
  successRate: number;
  completionRate: number;
  skillAverages: SkillAverages;
  monthlyProgress: MonthlyProgressPoint[];
  weeklyProgress: WeeklyProgressPoint[];
  typeDistribution: TypeDistributionPoint[];
  difficultyDistribution: DifficultyDistributionPoint[];
}

export const analyticsApi = {
  getOverview: () => apiClient.get<AnalyticsOverview>("/analytics/overview"),

  getSummary: () => apiClient.get<AnalyticsSummary>("/analytics"),

  getScoreTrend: (range: "30d" | "90d" | "all" = "30d") =>
    apiClient.get<{ trend: ScoreTrendPoint[] }>(`/analytics/score-trend?range=${range}`),

  getCategoryBreakdown: () =>
    apiClient.get<{ breakdown: CategoryBreakdownPoint[] }>("/analytics/category-breakdown"),
};
