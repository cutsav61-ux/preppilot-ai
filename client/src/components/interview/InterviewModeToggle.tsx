"use client";

import { Keyboard, Mic } from "lucide-react";
import { cn } from "@/lib/utils";

export type InterviewMode = "text" | "voice";

export function InterviewModeToggle({
  mode,
  onChange,
  voiceSupported,
}: {
  mode: InterviewMode;
  onChange: (mode: InterviewMode) => void;
  voiceSupported: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <div className="inline-flex items-center gap-1 rounded-md bg-ink/5 p-1">
        <button
          type="button"
          onClick={() => onChange("text")}
          className={cn(
            "flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-sm font-medium transition-colors",
            mode === "text" ? "bg-surface text-ink shadow-sm" : "text-ink-soft hover:text-ink",
          )}
        >
          <Keyboard className="size-3.5" />
          Text
        </button>
        <button
          type="button"
          onClick={() => voiceSupported && onChange("voice")}
          disabled={!voiceSupported}
          title={voiceSupported ? undefined : "Voice mode needs a Chromium-based browser"}
          className={cn(
            "flex items-center gap-1.5 rounded-sm px-3 py-1.5 text-sm font-medium transition-colors",
            !voiceSupported && "cursor-not-allowed opacity-40",
            mode === "voice" ? "bg-surface text-ink shadow-sm" : "text-ink-soft hover:text-ink",
          )}
        >
          <Mic className="size-3.5" />
          Voice
        </button>
      </div>
      {!voiceSupported && (
        <p className="text-xs text-ink-soft">
          Voice mode isn't supported in this browser — try Chrome on desktop or Android.
        </p>
      )}
    </div>
  );
}
