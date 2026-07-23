import { apiClient } from "@/lib/apiClient";
import type { Interview } from "@/types/interview";
import type { InterviewType, Difficulty } from "@/types/user";

interface ListParams {
  limit?: number;
  page?: number;
  type?: InterviewType;
  difficulty?: Difficulty;
  status?: "in_progress" | "completed" | "abandoned";
  search?: string;
}

function buildListQuery(params?: ListParams) {
  const search = new URLSearchParams();
  if (params?.limit) search.set("limit", String(params.limit));
  if (params?.page) search.set("page", String(params.page));
  if (params?.type) search.set("type", params.type);
  if (params?.difficulty) search.set("difficulty", params.difficulty);
  if (params?.status) search.set("status", params.status);
  if (params?.search) search.set("search", params.search);
  const query = search.toString();
  return query ? `?${query}` : "";
}

export const interviewApi = {
  create: (input: {
    type: InterviewType;
    difficulty: Difficulty;
    topic: string;
    company?: string;
    numQuestions: number;
  }) => apiClient.post<{ interview: Interview }>("/interviews", input),

  getById: (id: string) => apiClient.get<{ interview: Interview }>(`/interviews/${id}`),

  list: (params?: ListParams) =>
    apiClient.get<{ interviews: Interview[] }>(`/interviews${buildListQuery(params)}`),

  /** Same endpoint as `list`, but also resolves the `meta` (page/total/totalPages) for History pagination. */
  listPaginated: (params?: ListParams) =>
    apiClient.getPaginated<{ interviews: Interview[] }>(`/interviews${buildListQuery(params)}`),

  submitAnswer: (
    interviewId: string,
    input: { questionOrder: number; answerText: string; timeTakenSeconds: number },
  ) => apiClient.post<{ interview: Interview }>(`/interviews/${interviewId}/answers`, input),

  complete: (interviewId: string) =>
    apiClient.post<{ interview: Interview }>(`/interviews/${interviewId}/complete`),

  abandon: (interviewId: string) =>
    apiClient.patch<{ interview: Interview }>(`/interviews/${interviewId}/abandon`),
};
