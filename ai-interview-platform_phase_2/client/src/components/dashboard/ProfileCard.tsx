import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { ROUTES } from "@/lib/constants";
import type { User } from "@/types/user";

function formatMemberSince(createdAt: string) {
  return new Date(createdAt).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function ProfileCard({ user }: { user: User }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="flex items-start gap-4 pt-6">
        <Avatar name={user.name} src={user.avatarUrl} size="lg" />
        <div className="min-w-0 flex-1">
          <h3 className="truncate font-display text-lg font-medium text-ink">{user.name}</h3>
          <p className="truncate text-sm text-ink-soft">{user.email}</p>
          <div className="mt-2 flex flex-wrap gap-1.5">
            <Badge variant="cobalt">{user.experienceLevel}</Badge>
            {user.targetRole && <Badge variant="neutral">{user.targetRole}</Badge>}
          </div>
          <p className="mt-3 text-xs text-ink-soft">
            Member since {formatMemberSince(user.createdAt)}
          </p>
        </div>
        <motion.div whileHover={{ x: 2 }}>
          <Link
            href={ROUTES.profile}
            className="flex items-center gap-1 text-xs font-medium text-cobalt"
          >
            Edit
            <ArrowUpRight className="size-3.5" />
          </Link>
        </motion.div>
      </CardContent>
    </Card>
  );
}
