"use client";

import { useEffect, useRef } from "react";
import { Volume2, VolumeX, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { VoiceWaveAnimation } from "@/components/interview/VoiceWaveAnimation";
import { cn } from "@/lib/utils";

export function VoiceQuestionPlayer({
  questionText,
  questionKey,
  isSupported,
  isSpeaking,
  isMuted,
  onSpeak,
  onStop,
  onToggleMute,
}: {
  questionText: string;
  /** Changes whenever the question changes — triggers auto-speak and stops any prior utterance. */
  questionKey: string | number;
  isSupported: boolean;
  isSpeaking: boolean;
  isMuted: boolean;
  onSpeak: (text: string) => void;
  onStop: () => void;
  onToggleMute: () => void;
}) {
  const hasSpokenRef = useRef<string | number | null>(null);

  // Auto-speak once per question, and always stop any prior utterance when
  // moving on — satisfies "stop speaking when moving to next question".
  useEffect(() => {
    onStop();
    if (isSupported && !isMuted && hasSpokenRef.current !== questionKey) {
      hasSpokenRef.current = questionKey;
      onSpeak(questionText);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questionKey, isMuted, isSupported]);

  if (!isSupported) {
    return (
      <p className="text-xs text-ink-soft">
        Your browser can't read questions aloud — the question text below still works normally.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-md border border-border bg-surface p-3">
      <div className="flex items-center gap-3">
        <span
          className={cn(
            "flex size-9 items-center justify-center rounded-full",
            isSpeaking ? "bg-cobalt-soft text-cobalt" : "bg-ink/5 text-ink-soft",
          )}
        >
          {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        </span>
        <div>
          <p className="text-sm font-medium text-ink">
            {isSpeaking ? "Reading the question..." : "AI interviewer"}
          </p>
          <VoiceWaveAnimation active={isSpeaking} variant="speaking" className="mt-1" />
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onSpeak(questionText)}
          disabled={isMuted}
        >
          <RotateCcw className="size-4" />
          Replay
        </Button>
        <Button variant="ghost" size="sm" onClick={onToggleMute}>
          {isMuted ? <VolumeX className="size-4" /> : <Volume2 className="size-4" />}
        </Button>
      </div>
    </div>
  );
}
