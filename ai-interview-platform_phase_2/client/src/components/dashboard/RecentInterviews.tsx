import { FileStack } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";

/**
 * Phase 2 foundation: there's no Interview model or API yet (explicitly out
 * of scope for this phase), so this renders an honest empty state rather
 * than fabricated sessions. Once Phase 5 lands, swap this for a real list
 * fetched from GET /api/v1/interviews?limit=5.
 */
export function RecentInterviews() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent interviews</CardTitle>
        <CardDescription>Your last few sessions will show up here.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col items-center gap-3 rounded-md border border-dashed border-border py-10 text-center">
          <span className="flex size-10 items-center justify-center rounded-full bg-ink/5 text-ink-soft">
            <FileStack className="size-5" />
          </span>
          <p className="text-sm text-ink">No interviews yet.</p>
          <p className="max-w-[220px] text-xs text-ink-soft">
            The interview generator lands in a future phase — this list will fill up once it's
            live.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
