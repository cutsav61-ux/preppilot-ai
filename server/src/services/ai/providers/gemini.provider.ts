import { GoogleGenAI } from "@google/genai";
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

const GEMINI_MODEL = "gemini-2.5-flash";

let client: GoogleGenAI | null = null;

function getClient(): GoogleGenAI {
  if (!env.GEMINI_API_KEY) {
    throw new Error("GEMINI_API_KEY is not configured");
  }
  if (!client) {
    client = new GoogleGenAI({ apiKey: env.GEMINI_API_KEY });
  }
  return client;
}

function extractText(response: { text?: string }): string {
  const text = response.text;
  if (!text) {
    throw new Error("Gemini response contained no text content");
  }
  return text;
}

export const geminiProvider = {
  async generateQuestionsRaw(params: GenerateQuestionsParams): Promise<string> {
    const ai = getClient();

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: buildQuestionGenerationPrompt(params),
      config: {
        systemInstruction: QUESTION_GENERATION_SYSTEM_PROMPT,
        // Guarantees valid, parseable JSON — the same guard we rely on for
        // every provider so a stray "Sure, here's the JSON:" prefix can
        // never silently break JSON.parse downstream.
        responseMimeType: "application/json",
        maxOutputTokens: 1200,
      },
    });

    return extractText(response);
  },

  async generateEvaluationRaw(params: EvaluateInterviewParams): Promise<string> {
    const ai = getClient();

    const response = await ai.models.generateContent({
      model: GEMINI_MODEL,
      contents: buildEvaluationPrompt(params),
      config: {
        systemInstruction: INTERVIEW_EVALUATION_SYSTEM_PROMPT,
        responseMimeType: "application/json",
        maxOutputTokens: 4000,
      },
    });

    return extractText(response);
  },
};
