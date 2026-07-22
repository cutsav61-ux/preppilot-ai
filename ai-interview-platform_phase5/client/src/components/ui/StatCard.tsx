import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/Card";

export interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  sublabel?: string;
}

export function StatCard({ icon: Icon, label, value, sublabel }: StatCardProps) {
  return (
    <Card className="p-5">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wide text-ink-soft">{label}</span>
        <Icon className="size-4 text-cobalt" />
      </div>
      <p className="mt-3 font-display text-2xl font-semibold text-ink">{value}</p>
      {sublabel && <p className="mt-1 text-xs text-ink-soft">{sublabel}</p>}
    </Card>
  );
}
