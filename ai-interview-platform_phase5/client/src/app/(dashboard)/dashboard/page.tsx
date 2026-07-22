"use client";

import { motion } from "framer-motion";
import { useProfile } from "@/hooks/useProfile";
import { ProfileCard } from "@/components/dashboard/ProfileCard";
import { StatsGrid } from "@/components/dashboard/StatsGrid";
import { StreakWidget } from "@/components/dashboard/StreakWidget";
import { QuickStartCard } from "@/components/dashboard/QuickStartCard";
import { RecentInterviews } from "@/components/dashboard/RecentInterviews";
import { PerformanceCards } from "@/components/dashboard/PerformanceCards";
import { ScoreTrendChart } from "@/components/charts/ScoreTrendChart";
import { CategoryBreakdownChart } from "@/components/charts/CategoryBreakdownChart";
import { TypeDistributionChart } from "@/components/charts/TypeDistributionChart";
import { SkillAveragesChart } from "@/components/charts/SkillAveragesChart";
import { useScoreTrend, useCategoryBreakdown, useAnalyticsSummary } from "@/hooks/useAnalytics";
import { Skeleton } from "@/components/ui/Skeleton";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

function DashboardSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <Skeleton className="h-28 w-full rounded-lg" />
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-lg" />
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-2">
        <Skeleton className="h-60 w-full rounded-lg" />
        <Skeleton className="h-60 w-full rounded-lg" />
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { profile, isLoading } = useProfile();
  const { data: scoreTrend } = useScoreTrend("30d");
  const { data: categoryBreakdown } = useCategoryBreakdown();
  const { data: summary } = useAnalyticsSummary();

  if (isLoading || !profile) {
    return <DashboardSkeleton />;
  }

  const monthlyProgressAsTrend = summary?.monthlyProgress.map((point) => ({
    date: point.month,
    score: point.avgScore,
  }));

  return (
    <motion.div variants={container} initial="hidden" animate="show" className="flex flex-col gap-6">
      <motion.div variants={item}>
        <ProfileCard user={profile} />
      </motion.div>

      <motion.div variants={item}>
        <StatsGrid user={profile} />
      </motion.div>

      <motion.div variants={item} className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <StreakWidget currentStreak={profile.stats.currentStreak} />
        </div>
        <div className="lg:col-span-2">
          <QuickStartCard />
        </div>
      </motion.div>

      <motion.div variants={item} className="grid gap-4 lg:grid-cols-2">
        <RecentInterviews />
        <ScoreTrendChart data={scoreTrend} />
      </motion.div>

      <motion.div variants={item}>
        <CategoryBreakdownChart data={categoryBreakdown} />
      </motion.div>

      {summary && (
        <>
          <motion.div variants={item}>
            <h2 className="mb-3 font-display text-lg font-medium text-ink">Performance trends</h2>
            <PerformanceCards summary={summary} />
          </motion.div>

          <motion.div variants={item} className="grid gap-4 lg:grid-cols-2">
            <ScoreTrendChart
              data={monthlyProgressAsTrend}
              title="Monthly progress"
              description="Average score by month, last 6 months."
              emptyMessage="Complete interviews across a few months to see this trend."
            />
            <SkillAveragesChart skills={summary.skillAverages} />
          </motion.div>

          <motion.div variants={item}>
            <TypeDistributionChart data={summary.typeDistribution} />
          </motion.div>
        </>
      )}
    </motion.div>
  );
}
