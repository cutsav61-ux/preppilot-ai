"use client";

import { useInterviewSessionStore } from "@/store/interviewSessionStore";

/**
 * Phase 0 foundation only.
 * Exposes the local interview-session UI state (active interview id,
 * current question index). Fetching the interview, submitting answers,
 * and completing the session via TanStack Query mutations are added in
 * Phase 4 (generator) and Phase 5 (live flow + evaluation).
 */
export function useInterview() {
  const { interviewId, currentQuestionIndex, setInterview, goToQuestion, reset } =
    useInterviewSessionStore();

  return { interviewId, currentQuestionIndex, setInterview, goToQuestion, reset };
}
