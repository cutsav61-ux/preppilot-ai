import OpenAI from "openai";
import { env } from "../../../config/env";
import {
  buildQuestionGenerationPrompt,
  QUESTION_GENERATION_SYSTEM_PROMPT,
  type GenerateQuestionsParams,
} from "../prompts/generateQuestions.prompt";
import {
  buildEvaluationPrompt,
  INTERVIEW_EVALUATION_SYSTEM_PROMPT,
  type EvaluateInterviewParams,
} from "../prompts/evaluateInterview.prompt";

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!env.OPENAI_API_KEY) {
    throw new Error("OPENAI_API_KEY is not configured");
  }
  if (!client) {
    client = new OpenAI({ apiKey: env.OPENAI_API_KEY });
  }
  return client;
}

export const openaiProvider = {
  async generateQuestionsRaw(params: GenerateQuestionsParams): Promise<string> {
    const openai = getClient();

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      max_tokens: 1200,
      messages: [
        { role: "system", content: QUESTION_GENERATION_SYSTEM_PROMPT },
        { role: "user", content: buildQuestionGenerationPrompt(params) },
      ],
    });

    const text = response.choices[0]?.message?.content;
    if (!text) {
      throw new Error("OpenAI response contained no content");
    }
    return text;
  },

  async generateEvaluationRaw(params: EvaluateInterviewParams): Promise<string> {
    const openai = getClient();

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      max_tokens: 4000,
      messages: [
        { role: "system", content: INTERVIEW_EVALUATION_SYSTEM_PROMPT },
        { role: "user", content: buildEvaluationPrompt(params) },
      ],
    });

    const text = response.choices[0]?.message?.content;
    if (!text) {
      throw new Error("OpenAI response contained no content");
    }
    return text;
  },
};
