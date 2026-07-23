"use client";

import { useCallback, useEffect, useRef, useState } from "react";

export type SpeechRecognitionErrorKind =
  | "not-allowed"
  | "no-speech"
  | "network"
  | "audio-capture"
  | "aborted"
  | "unsupported"
  | "unknown";

interface UseSpeechRecognitionResult {
  isSupported: boolean;
  isListening: boolean;
  /** Confirmed text from completed speech segments. */
  finalTranscript: string;
  /** Not-yet-finalized text currently being spoken. */
  interimTranscript: string;
  error: SpeechRecognitionErrorKind | null;
  start: () => void;
  stop: () => void;
  reset: () => void;
}

function getSpeechRecognitionCtor(): { new (): SpeechRecognition } | null {
  if (typeof window === "undefined") return null;
  return window.SpeechRecognition ?? window.webkitSpeechRecognition ?? null;
}

function mapError(rawError: string): SpeechRecognitionErrorKind {
  switch (rawError) {
    case "not-allowed":
    case "service-not-allowed":
      return "not-allowed";
    case "no-speech":
      return "no-speech";
    case "network":
      return "network";
    case "audio-capture":
      return "audio-capture";
    case "aborted":
      return "aborted";
    default:
      return "unknown";
  }
}

/**
 * Thin wrapper around the browser's native SpeechRecognition API (Chrome-only
 * in practice — Safari/Firefox don't implement it). Feature-detects on
 * mount; every consumer must check `isSupported` before offering voice mode.
 */
export function useSpeechRecognition(): UseSpeechRecognitionResult {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [finalTranscript, setFinalTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");
  const [error, setError] = useState<SpeechRecognitionErrorKind | null>(null);

  const recognitionRef = useRef<SpeechRecognition | null>(null);

  useEffect(() => {
    const Ctor = getSpeechRecognitionCtor();
    if (!Ctor) {
      setIsSupported(false);
      return;
    }
    setIsSupported(true);

    const recognition = new Ctor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en-US";

    recognition.onresult = (event) => {
      let interim = "";
      let final = "";
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const result = event.results[i];
        if (!result) continue;
        const text = result[0]?.transcript ?? "";
        if (result.isFinal) {
          final += `${text} `;
        } else {
          interim += text;
        }
      }
      if (final) {
        setFinalTranscript((prev) => `${prev}${final}`.trim());
      }
      setInterimTranscript(interim);
    };

    recognition.onerror = (event) => {
      setError(mapError(event.error));
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setInterimTranscript("");
    };

    recognitionRef.current = recognition;

    return () => {
      recognition.onresult = null;
      recognition.onerror = null;
      recognition.onend = null;
      recognition.abort();
    };
  }, []);

  const start = useCallback(() => {
    if (!recognitionRef.current) {
      setError("unsupported");
      return;
    }
    setError(null);
    try {
      recognitionRef.current.start();
      setIsListening(true);
    } catch {
      // start() throws if already listening — safe to ignore.
    }
  }, []);

  const stop = useCallback(() => {
    recognitionRef.current?.stop();
    setIsListening(false);
  }, []);

  const reset = useCallback(() => {
    setFinalTranscript("");
    setInterimTranscript("");
    setError(null);
  }, []);

  return { isSupported, isListening, finalTranscript, interimTranscript, error, start, stop, reset };
}
