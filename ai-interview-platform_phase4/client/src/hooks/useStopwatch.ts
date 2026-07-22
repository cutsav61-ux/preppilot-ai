"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts up in whole seconds from the moment `resetKey` changes (typically
 * the current question's order), so switching questions restarts the clock.
 * Call `getElapsedSeconds()` at the moment of navigating away to capture
 * the final value without waiting for a re-render.
 */
export function useStopwatch(resetKey: string | number) {
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const startRef = useRef(Date.now());

  useEffect(() => {
    startRef.current = Date.now();
    setElapsedSeconds(0);

    const interval = setInterval(() => {
      setElapsedSeconds(Math.floor((Date.now() - startRef.current) / 1000));
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey]);

  const getElapsedSeconds = () => Math.floor((Date.now() - startRef.current) / 1000);

  return { elapsedSeconds, getElapsedSeconds };
}

export function formatSeconds(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
}
