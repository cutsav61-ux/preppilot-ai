"use client";

import { Sun, Moon, Monitor } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const OPTIONS = [
  { value: "light" as const, label: "Light", icon: Sun },
  { value: "dark" as const, label: "Dark", icon: Moon },
  { value: "system" as const, label: "System", icon: Monitor },
];

export function ThemeSettings() {
  const { theme, setTheme, mounted } = useTheme();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>Choose how the app looks on this device.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {OPTIONS.map((option) => {
            const isActive = mounted && theme === option.value;
            return (
              <button
                key={option.value}
                type="button"
                onClick={() => setTheme(option.value)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-lg border py-4 text-sm font-medium transition-colors",
                  isActive
                    ? "border-cobalt bg-cobalt-soft text-cobalt"
                    : "border-border text-ink-soft hover:border-cobalt/40 hover:text-ink",
                )}
              >
                <option.icon className="size-4" />
                {option.label}
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
