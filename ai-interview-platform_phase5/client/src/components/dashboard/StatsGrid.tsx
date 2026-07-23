import { motion } from "framer-motion";
import { BarChart3, Target, Flame, Calendar } from "lucide-react";
import { StatCard } from "@/components/ui/StatCard";
import type { User } from "@/types/user";

function formatMemberSince(createdAt: string) {
  return new Date(createdAt).toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3, ease: "easeOut" as const } },
};

export function StatsGrid({ user }: { user: User }) {
  const { stats } = user;

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-2 gap-4 lg:grid-cols-4"
    >
      <motion.div variants={item}>
        <StatCard
          icon={BarChart3}
          label="Total interviews"
          value={String(stats.totalInterviews)}
          sublabel={stats.totalInterviews === 0 ? "Start your first one" : "Completed sessions"}
        />
      </motion.div>
      <motion.div variants={item}>
        <StatCard
          icon={Target}
          label="Average score"
          value={stats.totalInterviews === 0 ? "—" : `${Math.round(stats.avgScore)}`}
          sublabel={stats.totalInterviews === 0 ? "No sessions yet" : "Out of 100"}
        />
      </motion.div>
      <motion.div variants={item}>
        <StatCard
          icon={Flame}
          label="Current streak"
          value={`${stats.currentStreak}`}
          sublabel={stats.currentStreak === 0 ? "Days in a row" : "Keep it going"}
        />
      </motion.div>
      <motion.div variants={item}>
        <StatCard icon={Calendar} label="Member since" value={formatMemberSince(user.createdAt)} />
      </motion.div>
    </motion.div>
  );
}
