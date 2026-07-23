"use client";

import { motion } from "framer-motion";
import { ThemeSettings } from "@/components/settings/ThemeSettings";
import { NotificationSettings } from "@/components/settings/NotificationSettings";
import { SecuritySettings } from "@/components/settings/SecuritySettings";
import { DangerZone } from "@/components/settings/DangerZone";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

export default function SettingsPage() {
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto flex max-w-2xl flex-col gap-6"
    >
      <motion.div variants={item}>
        <h1 className="font-display text-xl font-medium text-ink">Settings</h1>
        <p className="mt-1 text-sm text-ink-soft">Manage your account, security, and preferences.</p>
      </motion.div>

      <motion.div variants={item}>
        <ThemeSettings />
      </motion.div>

      <motion.div variants={item}>
        <NotificationSettings />
      </motion.div>

      <motion.div variants={item}>
        <SecuritySettings />
      </motion.div>

      <motion.div variants={item}>
        <DangerZone />
      </motion.div>
    </motion.div>
  );
}
