import { apiClient } from "@/lib/apiClient";
import type { Interview } from "@/types/interview";
import type { InterviewType, Difficulty } from "@/types/user";

export const interviewApi = {
  create: (input: { type: InterviewType; difficulty: Difficulty; topic: string; numQuestions: number }) =>
    apiClient.post<{ interview: Interview }>("/interviews", input),

  getById: (id: string) => apiClient.get<{ interview: Interview }>(`/interviews/${id}`),

  list: (params?: { limit?: number; page?: number }) => {
    const search = new URLSearchParams();
    if (params?.limit) search.set("limit", String(params.limit));
    if (params?.page) search.set("page", String(params.page));
    const query = search.toString();
    return apiClient.get<{ interviews: Interview[] }>(`/interviews${query ? `?${query}` : ""}`);
  },

  submitAnswer: (
    interviewId: string,
    input: { questionOrder: number; answerText: string; timeTakenSeconds: number },
  ) => apiClient.post<{ interview: Interview }>(`/interviews/${interviewId}/answers`, input),

  complete: (interviewId: string) =>
    apiClient.post<{ interview: Interview }>(`/interviews/${interviewId}/complete`),

  abandon: (interviewId: string) =>
    apiClient.patch<{ interview: Interview }>(`/interviews/${interviewId}/abandon`),
};
