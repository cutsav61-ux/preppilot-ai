"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Mic, Square, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { VoiceWaveAnimation } from "@/components/interview/VoiceWaveAnimation";
import { useSpeechRecognition } from "@/hooks/useSpeechRecognition";
import { cn } from "@/lib/utils";

const ERROR_MESSAGES: Record<string, string> = {
  "not-allowed":
    "Microphone permission was denied. Allow microphone access in your browser's site settings, then try again.",
  "no-speech": "Didn't catch that — try speaking again.",
  network: "Voice recognition lost its network connection. Try again.",
  "audio-capture": "No microphone was found. Check that a microphone is connected.",
  unsupported: "Voice input isn't supported in this browser.",
  unknown: "Something went wrong with voice input. Try again, or switch to text mode.",
};

export function VoiceAnswerRecorder({
  value,
  onChange,
  disabled,
  onSupportChange,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  /** Reports feature-detection up so the parent can hide the Voice mode option entirely if needed. */
  onSupportChange?: (isSupported: boolean) => void;
}) {
  const { isSupported, isListening, finalTranscript, interimTranscript, error, start, stop, reset } =
    useSpeechRecognition();

  const baseTextRef = useRef("");

  useEffect(() => {
    onSupportChange?.(isSupported);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isSupported]);

  // Live-update the shared answer draft while listening — this is what
  // makes the transcript appear in the (already-rendered) AnswerEditor in
  // real time, satisfying "show transcript while speaking".
  useEffect(() => {
    if (!isListening) return;
    const base = baseTextRef.current ? `${baseTextRef.current} ` : "";
    const combined = `${base}${finalTranscript}${interimTranscript ? ` ${interimTranscript}` : ""}`;
    onChange(combined.trim());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [finalTranscript, interimTranscript, isListening]);

  const handleToggleRecording = () => {
    if (isListening) {
      stop();
      return;
    }
    baseTextRef.current = value;
    reset();
    start();
  };

  if (!isSupported) {
    return null;
  }

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-3 rounded-md border border-border bg-surface p-3">
        <motion.div layout>
          <Button
            type="button"
            variant={isListening ? "destructive" : "cobalt"}
            size="sm"
            onClick={handleToggleRecording}
            disabled={disabled}
          >
            {isListening ? <Square className="size-4" /> : <Mic className="size-4" />}
            {isListening ? "Stop recording" : "Start recording"}
          </Button>
        </motion.div>

        <div className="flex items-center gap-2">
          {isListening && (
            <span className="relative flex size-2.5">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-coral opacity-75" />
              <span className="relative inline-flex size-2.5 rounded-full bg-coral" />
            </span>
          )}
          <VoiceWaveAnimation active={isListening} variant="recording" />
        </div>

        <p className="ml-auto text-xs text-ink-soft">
          {isListening ? "Listening..." : "Tap to speak your answer"}
        </p>
      </div>

      {error && (
        <div
          className={cn(
            "flex items-start gap-2 rounded-md px-3 py-2 text-xs",
            "bg-coral-soft text-coral",
          )}
        >
          <AlertTriangle className="mt-0.5 size-3.5 shrink-0" />
          {ERROR_MESSAGES[error] ?? ERROR_MESSAGES.unknown}
        </div>
      )}
    </div>
  );
}
