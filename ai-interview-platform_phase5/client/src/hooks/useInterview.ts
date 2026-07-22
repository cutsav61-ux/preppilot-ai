"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { interviewApi } from "@/lib/api/interview.api";
import { useInterviewSessionStore } from "@/store/interviewSessionStore";
import { ApiError } from "@/lib/apiClient";
import { ROUTES } from "@/lib/constants";

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback;
}

/** Fetches a single interview by id — the live session and its completed recap both use this. */
export function useInterviewSession(interviewId: string | undefined) {
  return useQuery({
    queryKey: ["interview", interviewId],
    queryFn: () => interviewApi.getById(interviewId as string),
    enabled: Boolean(interviewId),
    select: (data) => data.interview,
  });
}

/** Recent interviews for the dashboard — small, unfiltered, most-recent-first. */
export function useRecentInterviews(limit = 5) {
  return useQuery({
    queryKey: ["interviews", "recent", limit],
    queryFn: () => interviewApi.list({ limit }),
    select: (data) => data.interviews,
  });
}

/** Filterable, paginated interview list for the History page. */
export function useInterviewHistory(filters: {
  page: number;
  type?: "technical" | "hr";
  difficulty?: "easy" | "medium" | "hard";
  status?: "in_progress" | "completed" | "abandoned";
  search?: string;
}) {
  return useQuery({
    queryKey: ["interviews", "history", filters],
    queryFn: () => interviewApi.listPaginated({ limit: 10, ...filters }),
  });
}

export function useInterviewActions() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const setInterview = useInterviewSessionStore((state) => state.setInterview);
  const goToQuestion = useInterviewSessionStore((state) => state.goToQuestion);
  const reset = useInterviewSessionStore((state) => state.reset);
  const currentQuestionIndex = useInterviewSessionStore((state) => state.currentQuestionIndex);

  const createMutation = useMutation({
    mutationFn: interviewApi.create,
    onSuccess: ({ interview }) => {
      setInterview(interview.id);
      queryClient.invalidateQueries({ queryKey: ["interviews", "recent"] });
      router.push(`/interview/${interview.id}`);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Couldn't start the interview. Please try again."));
    },
  });

  const submitAnswerMutation = useMutation({
    mutationFn: ({
      interviewId,
      questionOrder,
      answerText,
      timeTakenSeconds,
    }: {
      interviewId: string;
      questionOrder: number;
      answerText: string;
      timeTakenSeconds: number;
    }) => interviewApi.submitAnswer(interviewId, { questionOrder, answerText, timeTakenSeconds }),
    onSuccess: ({ interview }) => {
      queryClient.setQueryData(["interview", interview.id], { interview });
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Couldn't save that answer. Please try again."));
    },
  });

  const completeMutation = useMutation({
    mutationFn: interviewApi.complete,
    onSuccess: ({ interview }) => {
      queryClient.setQueryData(["interview", interview.id], { interview });
      queryClient.invalidateQueries({ queryKey: ["profile"] });
      queryClient.invalidateQueries({ queryKey: ["interviews", "recent"] });
      reset();
      toast.success("Interview complete.");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Couldn't finish the interview. Please try again."));
    },
  });

  return {
    createInterview: createMutation.mutateAsync,
    isCreating: createMutation.isPending,
    submitAnswer: submitAnswerMutation.mutateAsync,
    isSubmittingAnswer: submitAnswerMutation.isPending,
    completeInterview: completeMutation.mutateAsync,
    isCompleting: completeMutation.isPending,
    currentQuestionIndex,
    goToQuestion,
    resetSession: reset,
    cancelToDashboard: () => {
      reset();
      router.push(ROUTES.dashboard);
    },
  };
}
