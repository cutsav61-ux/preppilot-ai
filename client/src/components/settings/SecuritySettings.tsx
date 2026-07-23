"use client";

import { Monitor, X } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Skeleton } from "@/components/ui/Skeleton";
import { ChangePasswordCard } from "@/components/profile/ChangePasswordCard";
import { useSessions, useRevokeSession, useRevokeAllSessions } from "@/hooks/useSettings";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

export function SecuritySettings() {
  const { data: sessions, isLoading } = useSessions();
  const revokeSession = useRevokeSession();
  const revokeAll = useRevokeAllSessions();

  return (
    <div className="flex flex-col gap-6">
      <ChangePasswordCard />

      <Card>
        <CardHeader>
          <CardTitle>Active sessions</CardTitle>
          <CardDescription>
            Every device currently signed in to your account via a refresh token.
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-3">
          {isLoading ? (
            <>
              <Skeleton className="h-14 w-full rounded-md" />
              <Skeleton className="h-14 w-full rounded-md" />
            </>
          ) : !sessions || sessions.length === 0 ? (
            <p className="text-sm text-ink-soft">No active sessions found.</p>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between gap-3 rounded-md border border-border p-3"
              >
                <div className="flex items-center gap-3">
                  <span className="flex size-9 items-center justify-center rounded-md bg-ink/5 text-ink-soft">
                    <Monitor className="size-4" />
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-ink">{session.deviceInfo}</p>
                    <p className="text-xs text-ink-soft">
                      Signed in {formatDate(session.createdAt)}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => revokeSession.mutate(session.id)}
                  aria-label="Revoke session"
                  className="flex size-8 shrink-0 items-center justify-center rounded-md text-ink-soft transition-colors hover:bg-coral-soft hover:text-coral"
                >
                  <X className="size-4" />
                </button>
              </div>
            ))
          )}

          {sessions && sessions.length > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="mt-1 self-start"
              onClick={() => revokeAll.mutate()}
              isLoading={revokeAll.isPending}
            >
              Log out of all sessions
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
