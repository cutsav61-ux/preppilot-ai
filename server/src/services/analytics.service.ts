import { Interview } from "../models/Interview.model";
import { User } from "../models/User.model";
import { AppError } from "../middlewares/error.middleware";
import type { ScoreTrendQuery } from "../validators/analytics.validator";

const RANGE_DAYS: Record<ScoreTrendQuery["range"], number | null> = {
  "30d": 30,
  "90d": 90,
  all: null,
};

const SUCCESS_SCORE_THRESHOLD = 70;
const MONTHS_OF_HISTORY = 6;
const WEEKS_OF_HISTORY = 8;
const MS_PER_WEEK = 7 * 24 * 60 * 60 * 1000;

function monthLabel(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "short", year: "2-digit", timeZone: "UTC" });
}

/** Start-of-week (UTC Monday) label, e.g. "Jul 14". Used to bucket the weekly trend. */
function weekLabel(date: Date): string {
  const d = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  const day = d.getUTCDay();
  const diffToMonday = day === 0 ? 6 : day - 1;
  d.setUTCDate(d.getUTCDate() - diffToMonday);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });
}

/** Safe division that returns 0 instead of NaN when the denominator is 0. */
function safeAverage(sum: number, count: number): number {
  return count > 0 ? Math.round(sum / count) : 0;
}

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
      avgScore: safeAverage(sum, count),
      count,
    }));
  },

  /**
   * One combined payload for the richer dashboard analytics (highest/lowest,
   * monthly/weekly progress, skill averages, success rate, completion rate,
   * distributions). Fetches interviews once and derives everything from
   * that single set rather than running many separate queries. Every ratio
   * uses `safeAverage`/explicit zero-guards so the response can never
   * contain null, undefined, or NaN — the frontend can render "0"/"—"
   * directly without special-casing.
   */
  async getSummary(userId: string) {
    const [user, completedInterviews, allInterviews] = await Promise.all([
      User.findById(userId),
      Interview.find({ userId, status: "completed" }).select(
        "type topic difficulty completedAt overallFeedback",
      ),
      Interview.find({ userId }).select("type status difficulty"),
    ]);

    if (!user) {
      throw new AppError("Account no longer exists.", 404, "ACCOUNT_NOT_FOUND");
    }

    const scored = completedInterviews.filter((i) => i.overallFeedback);

    let highestScore = 0;
    let lowestScore = 0;
    let successCount = 0;
    const skillTotals = { communication: 0, technical: 0, problemSolving: 0, confidence: 0 };

    const monthlyTotals = new Map<string, { sum: number; count: number }>();
    for (let i = MONTHS_OF_HISTORY - 1; i >= 0; i -= 1) {
      const d = new Date();
      d.setUTCMonth(d.getUTCMonth() - i);
      monthlyTotals.set(monthLabel(d), { sum: 0, count: 0 });
    }

    const weeklyTotals = new Map<string, { sum: number; count: number }>();
    for (let i = WEEKS_OF_HISTORY - 1; i >= 0; i -= 1) {
      const d = new Date(Date.now() - i * MS_PER_WEEK);
      weeklyTotals.set(weekLabel(d), { sum: 0, count: 0 });
    }

    scored.forEach((interview, index) => {
      const feedback = interview.overallFeedback!;
      if (index === 0) {
        highestScore = feedback.overallScore;
        lowestScore = feedback.overallScore;
      } else {
        highestScore = Math.max(highestScore, feedback.overallScore);
        lowestScore = Math.min(lowestScore, feedback.overallScore);
      }

      if (feedback.overallScore >= SUCCESS_SCORE_THRESHOLD) successCount += 1;

      skillTotals.communication += feedback.communicationScore;
      skillTotals.technical += feedback.technicalScore;
      skillTotals.problemSolving += feedback.problemSolvingScore;
      skillTotals.confidence += feedback.confidenceScore;

      if (interview.completedAt) {
        const mLabel = monthLabel(interview.completedAt);
        if (monthlyTotals.has(mLabel)) {
          const existing = monthlyTotals.get(mLabel)!;
          existing.sum += feedback.overallScore;
          existing.count += 1;
        }

        const wLabel = weekLabel(interview.completedAt);
        if (weeklyTotals.has(wLabel)) {
          const existing = weeklyTotals.get(wLabel)!;
          existing.sum += feedback.overallScore;
          existing.count += 1;
        }
      }
    });

    const typeCounts = { technical: 0, hr: 0 };
    const statusCounts = { completed: 0, in_progress: 0, abandoned: 0 };
    const difficultyCounts = { easy: 0, medium: 0, hard: 0 };
    allInterviews.forEach((interview) => {
      typeCounts[interview.type] += 1;
      statusCounts[interview.status] += 1;
      difficultyCounts[interview.difficulty] += 1;
    });

    const finishedCount = statusCounts.completed + statusCounts.abandoned;

    return {
      totalInterviews: user.stats.totalInterviews,
      avgScore: user.stats.avgScore,
      currentStreak: user.stats.currentStreak,
      highestScore,
      lowestScore,
      successRate: safeAverage(successCount * 100, scored.length),
      completionRate: safeAverage(statusCounts.completed * 100, finishedCount),
      skillAverages: {
        communication: safeAverage(skillTotals.communication, scored.length),
        technical: safeAverage(skillTotals.technical, scored.length),
        problemSolving: safeAverage(skillTotals.problemSolving, scored.length),
        confidence: safeAverage(skillTotals.confidence, scored.length),
      },
      monthlyProgress: Array.from(monthlyTotals.entries()).map(([month, { sum, count }]) => ({
        month,
        avgScore: safeAverage(sum, count),
      })),
      weeklyProgress: Array.from(weeklyTotals.entries()).map(([week, { sum, count }]) => ({
        week,
        avgScore: safeAverage(sum, count),
      })),
      typeDistribution: [
        { type: "Technical", count: typeCounts.technical },
        { type: "HR", count: typeCounts.hr },
      ],
      difficultyDistribution: [
        { difficulty: "Easy", count: difficultyCounts.easy },
        { difficulty: "Medium", count: difficultyCounts.medium },
        { difficulty: "Hard", count: difficultyCounts.hard },
      ],
    };
  },
};
