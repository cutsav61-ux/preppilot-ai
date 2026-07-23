import Anthropic from "@anthropic-ai/sdk";
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

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!env.ANTHROPIC_API_KEY) {
    throw new Error("ANTHROPIC_API_KEY is not configured");
  }
  if (!client) {
    client = new Anthropic({ apiKey: env.ANTHROPIC_API_KEY });
  }
  return client;
}

export const anthropicProvider = {
  async generateQuestionsRaw(params: GenerateQuestionsParams): Promise<string> {
    const anthropic = getClient();

    const response = await anthropic.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 1200,
      system: QUESTION_GENERATION_SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildQuestionGenerationPrompt(params) }],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("Anthropic response contained no text content");
    }
    return textBlock.text;
  },

  async generateEvaluationRaw(params: EvaluateInterviewParams): Promise<string> {
    const anthropic = getClient();

    // Evaluation needs sharper judgment than question generation, so it
    // uses the stronger model despite the extra cost/latency.
    const response = await anthropic.messages.create({
      model: "claude-sonnet-5",
      max_tokens: 4000,
      system: INTERVIEW_EVALUATION_SYSTEM_PROMPT,
      messages: [{ role: "user", content: buildEvaluationPrompt(params) }],
    });

    const textBlock = response.content.find((block) => block.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("Anthropic response contained no text content");
    }
    return textBlock.text;
  },
};
