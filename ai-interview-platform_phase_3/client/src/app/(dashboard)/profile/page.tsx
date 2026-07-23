"use client";

import { motion } from "framer-motion";
import { LogOut } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { useAuth } from "@/hooks/useAuth";
import { ProfileHeader } from "@/components/profile/ProfileHeader";
import { ProfileForm } from "@/components/profile/ProfileForm";
import { ChangePasswordCard } from "@/components/profile/ChangePasswordCard";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

function ProfileSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Skeleton className="size-14 rounded-full" />
        <div className="flex flex-col gap-2">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-52" />
        </div>
      </div>
      <Skeleton className="h-64 w-full rounded-lg" />
      <Skeleton className="h-56 w-full rounded-lg" />
    </div>
  );
}

export default function ProfilePage() {
  const { profile, isLoading } = useProfile();
  const { logout, isLoggingOut } = useAuth();

  if (isLoading || !profile) {
    return (
      <div className="mx-auto max-w-2xl">
        <ProfileSkeleton />
      </div>
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="mx-auto flex max-w-2xl flex-col gap-6"
    >
      <motion.div variants={item} className="flex items-start justify-between">
        <ProfileHeader user={profile} />
        <Button
          variant="ghost"
          size="sm"
          onClick={() => logout()}
          isLoading={isLoggingOut}
          className="shrink-0"
        >
          <LogOut className="size-4" />
          Log out
        </Button>
      </motion.div>

      <motion.div variants={item}>
        <ProfileForm user={profile} />
      </motion.div>

      <motion.div variants={item}>
        <ChangePasswordCard />
      </motion.div>
    </motion.div>
  );
}
