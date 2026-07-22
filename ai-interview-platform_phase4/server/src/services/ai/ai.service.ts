import { z } from "zod";
import { env } from "../../config/env";
import { logger } from "../../utils/logger";
import { anthropicProvider } from "./providers/anthropic.provider";
import { openaiProvider } from "./providers/openai.provider";
import { getFallbackQuestions } from "./prompts/fallbackQuestions";
import { getFallbackEvaluation } from "./prompts/fallbackEvaluation";
import type { GenerateQuestionsParams } from "./prompts/generateQuestions.prompt";
import type { EvaluateInterviewParams } from "./prompts/evaluateInterview.prompt";

const questionsResponseSchema = z.object({
  questions: z
    .array(
      z.object({
        questionText: z.string().min(1),
        category: z.string().min(1),
      }),
    )
    .min(1),
});

const evaluationResponseSchema = z.object({
  questionEvaluations: z.array(
    z.object({
      order: z.number().int().min(1),
      score: z.number().min(0).max(100),
      explanation: z.string().min(1),
      strengths: z.array(z.string()).default([]),
      weaknesses: z.array(z.string()).default([]),
      suggestions: z.array(z.string()).default([]),
      idealAnswerSummary: z.string().default(""),
      confidence: z.number().min(0).max(100),
    }),
  ),
  overallFeedback: z.object({
    overallScore: z.number().min(0).max(100),
    communicationScore: z.number().min(0).max(100),
    technicalScore: z.number().min(0).max(100),
    problemSolvingScore: z.number().min(0).max(100),
    summary: z.string().min(1),
    topStrengths: z.array(z.string()).default([]),
    topImprovements: z.array(z.string()).default([]),
    recommendedTopics: z.array(z.string()).default([]),
    hiringRecommendation: z.string().min(1),
  }),
});

export interface GeneratedQuestion {
  order: number;
  questionText: string;
  category: string;
}

function extractJson(raw: string): string {
  // Models sometimes wrap JSON in markdown fences despite instructions not
  // to — strip them defensively rather than fail validation over formatting.
  const fenceMatch = raw.match(/```(?:json)?\s*([\s\S]*?)```/);
  return (fenceMatch?.[1] ?? raw).trim();
}

async function callProvider(params: GenerateQuestionsParams): Promise<string> {
  if (env.AI_PROVIDER === "openai") {
    return openaiProvider.generateQuestionsRaw(params);
  }
  return anthropicProvider.generateQuestionsRaw(params);
}

async function callEvaluationProvider(params: EvaluateInterviewParams): Promise<string> {
  if (env.AI_PROVIDER === "openai") {
    return openaiProvider.generateEvaluationRaw(params);
  }
  return anthropicProvider.generateEvaluationRaw(params);
}

export const aiService = {
  async generateQuestions(params: GenerateQuestionsParams): Promise<GeneratedQuestion[]> {
    try {
      const raw = await callProvider(params);
      const parsed = JSON.parse(extractJson(raw));
      const validated = questionsResponseSchema.parse(parsed);

      return validated.questions.slice(0, params.count).map((q, index) => ({
        order: index + 1,
        questionText: q.questionText,
        category: q.category,
      }));
    } catch (error) {
      logger.warn(
        { err: error, provider: env.AI_PROVIDER },
        "AI question generation failed — serving fallback question bank instead",
      );
      return getFallbackQuestions(params.type, params.difficulty, params.count).map(
        (q, index) => ({ order: index + 1, ...q }),
      );
    }
  },

  async evaluateInterview(params: EvaluateInterviewParams) {
    try {
      const raw = await callEvaluationProvider(params);
      const parsed = JSON.parse(extractJson(raw));
      const validated = evaluationResponseSchema.parse(parsed);

      // Guard against the model omitting or misordering questions — fill
      // any gap with a neutral placeholder rather than crash.
      const byOrder = new Map(validated.questionEvaluations.map((q) => [q.order, q]));
      const questionEvaluations = params.questions.map((q) => {
        const evaluation = byOrder.get(q.order);
        if (evaluation) return evaluation;
        logger.warn({ order: q.order }, "AI evaluation response missing a question — using placeholder");
        return {
          order: q.order,
          score: 0,
          explanation: "This question wasn't included in the AI's evaluation response.",
          strengths: [],
          weaknesses: [],
          suggestions: [],
          idealAnswerSummary: "",
          confidence: 0,
        };
      });

      return { questionEvaluations, overallFeedback: validated.overallFeedback };
    } catch (error) {
      logger.warn(
        { err: error, provider: env.AI_PROVIDER },
        "AI interview evaluation failed — serving fallback evaluation instead",
      );
      return getFallbackEvaluation(params.questions);
    }
  },
};
