import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import type { User } from "@/types/user";

export function ProfileHeader({ user }: { user: User }) {
  return (
    <div className="flex items-center gap-4">
      <Avatar name={user.name} src={user.avatarUrl} size="lg" />
      <div>
        <h1 className="font-display text-xl font-medium text-ink">{user.name}</h1>
        <p className="text-sm text-ink-soft">{user.email}</p>
        <div className="mt-2 flex gap-2">
          <Badge variant="cobalt">{user.experienceLevel}</Badge>
          {user.targetRole && <Badge variant="neutral">{user.targetRole}</Badge>}
        </div>
      </div>
    </div>
  );
}
