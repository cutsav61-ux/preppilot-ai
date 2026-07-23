"use client";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { useProfile } from "@/hooks/useProfile";
import { useUpdateSettings } from "@/hooks/useSettings";
import { cn } from "@/lib/utils";

export function NotificationSettings() {
  const { profile } = useProfile();
  const updateSettings = useUpdateSettings();

  if (!profile) return null;

  const { settings } = profile;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications & defaults</CardTitle>
        <CardDescription>Control emails and your default interview setup.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <label className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-ink">Email notifications</p>
            <p className="text-xs text-ink-soft">Updates about your account and new features.</p>
          </div>
          <button
            type="button"
            role="switch"
            aria-checked={settings.emailNotifications}
            onClick={() =>
              updateSettings.mutate({ emailNotifications: !settings.emailNotifications })
            }
            className={cn(
              "relative h-6 w-11 shrink-0 rounded-full transition-colors",
              settings.emailNotifications ? "bg-cobalt" : "bg-ink/15",
            )}
          >
            <span
              className={cn(
                "absolute top-0.5 size-5 rounded-full bg-white shadow transition-transform",
                settings.emailNotifications ? "translate-x-[22px]" : "translate-x-0.5",
              )}
            />
          </button>
        </label>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="defaultType" className="text-sm font-medium text-ink">
            Default interview type
          </label>
          <select
            id="defaultType"
            value={settings.defaultInterviewType ?? ""}
            onChange={(e) =>
              updateSettings.mutate({
                defaultInterviewType: (e.target.value || undefined) as "technical" | "hr" | undefined,
              })
            }
            className="h-11 w-full rounded-md border border-border bg-surface px-3.5 text-sm text-ink focus:border-cobalt focus:outline-none focus:ring-2 focus:ring-cobalt/20"
          >
            <option value="">No default</option>
            <option value="technical">Technical</option>
            <option value="hr">HR / Behavioral</option>
          </select>
        </div>

        <div className="flex flex-col gap-1.5">
          <label htmlFor="defaultDifficulty" className="text-sm font-medium text-ink">
            Default difficulty
          </label>
          <select
            id="defaultDifficulty"
            value={settings.defaultDifficulty ?? ""}
            onChange={(e) =>
              updateSettings.mutate({
                defaultDifficulty: (e.target.value || undefined) as
                  | "easy"
                  | "medium"
                  | "hard"
                  | undefined,
              })
            }
            className="h-11 w-full rounded-md border border-border bg-surface px-3.5 text-sm text-ink focus:border-cobalt focus:outline-none focus:ring-2 focus:ring-cobalt/20"
          >
            <option value="">No default</option>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </div>
      </CardContent>
    </Card>
  );
}
