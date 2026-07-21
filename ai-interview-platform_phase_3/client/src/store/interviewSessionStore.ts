import { create } from "zustand";

interface InterviewSessionState {
  interviewId: string | null;
  currentQuestionIndex: number;
  setInterview: (interviewId: string) => void;
  goToQuestion: (index: number) => void;
  reset: () => void;
}

/**
 * Tracks UI state for the live interview flow (Phase 5): which interview is
 * active and which question is on screen. Answers/evaluations are server
 * state, fetched and cached via TanStack Query, not duplicated here.
 */
export const useInterviewSessionStore = create<InterviewSessionState>((set) => ({
  interviewId: null,
  currentQuestionIndex: 0,
  setInterview: (interviewId) => set({ interviewId, currentQuestionIndex: 0 }),
  goToQuestion: (index) => set({ currentQuestionIndex: index }),
  reset: () => set({ interviewId: null, currentQuestionIndex: 0 }),
}));
