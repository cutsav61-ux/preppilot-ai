"use client";

import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, CheckCircle2, MessageSquare, Cpu, Puzzle, Sparkles } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import type { AnalyticsSummary } from "@/lib/api/analytics.api";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};

export function PerformanceCards({ summary }: { summary: AnalyticsSummary }) {
  const hasData = summary.totalInterviews > 0;

  return (
    <div className="flex flex-col gap-4">
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-4 lg:grid-cols-3"
      >
        <motion.div variants={item}>
          <StatCard
            icon={TrendingUp}
            label="Highest score"
            value={hasData ? String(summary.highestScore) : "—"}
            sublabel="Best session so far"
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard
            icon={TrendingDown}
            label="Lowest score"
            value={hasData ? String(summary.lowestScore) : "—"}
            sublabel="Room to improve"
          />
        </motion.div>
        <motion.div variants={item} className="col-span-2 lg:col-span-1">
          <StatCard
            icon={CheckCircle2}
            label="Success rate"
            value={hasData ? `${summary.successRate}%` : "—"}
            sublabel="Sessions scoring 70+"
          />
        </motion.div>
      </motion.div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-2 gap-4 lg:grid-cols-4"
      >
        <motion.div variants={item}>
          <StatCard
            icon={MessageSquare}
            label="Avg communication"
            value={hasData ? String(summary.skillAverages.communication) : "—"}
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard
            icon={Cpu}
            label="Avg technical"
            value={hasData ? String(summary.skillAverages.technical) : "—"}
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard
            icon={Puzzle}
            label="Avg problem solving"
            value={hasData ? String(summary.skillAverages.problemSolving) : "—"}
          />
        </motion.div>
        <motion.div variants={item}>
          <StatCard
            icon={Sparkles}
            label="Avg confidence"
            value={hasData ? String(summary.skillAverages.confidence) : "—"}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}
