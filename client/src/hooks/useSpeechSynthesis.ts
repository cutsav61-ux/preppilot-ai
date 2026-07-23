"use client";

import { useCallback, useEffect, useRef, useState } from "react";

interface UseSpeechSynthesisResult {
  isSupported: boolean;
  isSpeaking: boolean;
  isMuted: boolean;
  speak: (text: string) => void;
  stop: () => void;
  toggleMute: () => void;
}

function pickNaturalEnglishVoice(voices: SpeechSynthesisVoice[]): SpeechSynthesisVoice | null {
  const englishVoices = voices.filter((v) => v.lang.toLowerCase().startsWith("en"));
  if (englishVoices.length === 0) return null;

  // Prefer voices that sound more natural where the browser labels them as such.
  const preferredNames = ["natural", "google us english", "samantha", "google uk english female"];
  const preferred = englishVoices.find((v) =>
    preferredNames.some((name) => v.name.toLowerCase().includes(name)),
  );
  return preferred ?? englishVoices[0] ?? null;
}

/**
 * Thin wrapper around the browser's native SpeechSynthesis API. Mute is
 * "sticky" client-side state — muting cancels any in-progress speech and
 * suppresses future speak() calls until unmuted.
 */
export function useSpeechSynthesis(): UseSpeechSynthesisResult {
  const [isSupported, setIsSupported] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const voiceRef = useRef<SpeechSynthesisVoice | null>(null);
  const isMutedRef = useRef(false);

  useEffect(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      setIsSupported(false);
      return;
    }
    setIsSupported(true);

    const loadVoices = () => {
      voiceRef.current = pickNaturalEnglishVoice(window.speechSynthesis.getVoices());
    };
    loadVoices();
    window.speechSynthesis.addEventListener("voiceschanged", loadVoices);

    return () => {
      window.speechSynthesis.removeEventListener("voiceschanged", loadVoices);
      window.speechSynthesis.cancel();
    };
  }, []);

  const stop = useCallback(() => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
  }, []);

  const speak = useCallback(
    (text: string) => {
      if (!isSupported || isMutedRef.current || !text.trim()) return;
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      if (voiceRef.current) utterance.voice = voiceRef.current;
      utterance.rate = 1;
      utterance.pitch = 1;
      utterance.onstart = () => setIsSpeaking(true);
      utterance.onend = () => setIsSpeaking(false);
      utterance.onerror = () => setIsSpeaking(false);

      window.speechSynthesis.speak(utterance);
    },
    [isSupported],
  );

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      isMutedRef.current = next;
      if (next) stop();
      return next;
    });
  }, [stop]);

  return { isSupported, isSpeaking, isMuted, speak, stop, toggleMute };
}
