"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Counts down from `durationSeconds`, calling `onExpire` exactly once when
 * it hits zero. Resets whenever `resetKey` changes (typically the current
 * question's order) so each question gets a fresh countdown. Used only by
 * voice mode — text mode is untouched and keeps its own count-up timer.
 */
export function useCountdownTimer(
  durationSeconds: number,
  resetKey: string | number,
  onExpire: () => void,
) {
  const [remainingSeconds, setRemainingSeconds] = useState(durationSeconds);
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    setRemainingSeconds(durationSeconds);

    const interval = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onExpireRef.current();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetKey, durationSeconds]);

  return { remainingSeconds };
}
