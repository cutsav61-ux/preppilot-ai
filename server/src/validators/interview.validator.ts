import { z } from "zod";
import { DIFFICULTIES, INTERVIEW_TYPES } from "../config/constants";
import { sanitizeText } from "../utils/sanitize";

export const createInterviewSchema = z.object({
  type: z.enum(INTERVIEW_TYPES),
  difficulty: z.enum(DIFFICULTIES),
  topic: z.string().trim().min(2, "Tell us the role or topic").max(80).transform(sanitizeText),
  company: z.string().trim().max(100).transform(sanitizeText).optional().or(z.literal("")),
  numQuestions: z.coerce.number().int().min(3).max(10).default(5),
});
export type CreateInterviewInput = z.infer<typeof createInterviewSchema>;

export const submitAnswerSchema = z.object({
  questionOrder: z.coerce.number().int().min(1),
  answerText: z
    .string()
    .trim()
    .min(1, "Write an answer before submitting")
    .max(5000)
    .transform(sanitizeText),
  timeTakenSeconds: z.coerce.number().int().min(0).max(3600).default(0),
});
export type SubmitAnswerInput = z.infer<typeof submitAnswerSchema>;

export const listInterviewsQuerySchema = z.object({
  limit: z.coerce.number().int().min(1).max(50).default(10),
  page: z.coerce.number().int().min(1).default(1),
  type: z.enum(INTERVIEW_TYPES).optional(),
  difficulty: z.enum(DIFFICULTIES).optional(),
  status: z.enum(["in_progress", "completed", "abandoned"]).optional(),
  search: z.string().trim().max(100).optional(),
});
export type ListInterviewsQuery = z.infer<typeof listInterviewsQuerySchema>;
