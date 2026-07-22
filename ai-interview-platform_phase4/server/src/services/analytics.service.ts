import { Interview } from "../models/Interview.model";
import { User } from "../models/User.model";
import { AppError } from "../middlewares/error.middleware";
import type { ScoreTrendQuery } from "../validators/analytics.validator";

const RANGE_DAYS: Record<ScoreTrendQuery["range"], number | null> = {
  "30d": 30,
  "90d": 90,
  all: null,
};

export const analyticsService = {
  async getOverview(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("Account no longer exists.", 404, "ACCOUNT_NOT_FOUND");
    }
    return {
      totalInterviews: user.stats.totalInterviews,
      avgScore: user.stats.avgScore,
      currentStreak: user.stats.currentStreak,
      lastInterviewAt: user.stats.lastInterviewAt,
    };
  },

  async getScoreTrend(userId: string, query: ScoreTrendQuery) {
    const days = RANGE_DAYS[query.range];
    const filter: Record<string, unknown> = { userId, status: "completed" };

    if (days) {
      filter.completedAt = { $gte: new Date(Date.now() - days * 24 * 60 * 60 * 1000) };
    }

    const interviews = await Interview.find(filter)
      .select("completedAt overallFeedback.overallScore")
      .sort({ completedAt: 1 });

    return interviews
      .filter((interview) => interview.completedAt && interview.overallFeedback)
      .map((interview) => ({
        date: interview.completedAt!.toISOString().slice(0, 10),
        score: interview.overallFeedback!.overallScore,
      }));
  },

  async getCategoryBreakdown(userId: string) {
    const interviews = await Interview.find({ userId, status: "completed" }).select(
      "topic overallFeedback.overallScore",
    );

    const totalsByTopic = new Map<string, { sum: number; count: number }>();
    for (const interview of interviews) {
      if (!interview.overallFeedback) continue;
      const existing = totalsByTopic.get(interview.topic) ?? { sum: 0, count: 0 };
      existing.sum += interview.overallFeedback.overallScore;
      existing.count += 1;
      totalsByTopic.set(interview.topic, existing);
    }

    return Array.from(totalsByTopic.entries()).map(([topic, { sum, count }]) => ({
      topic,
      avgScore: Math.round(sum / count),
      count,
    }));
  },
};
