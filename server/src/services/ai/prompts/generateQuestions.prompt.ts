export interface GenerateQuestionsParams {
  type: "technical" | "hr";
  difficulty: "easy" | "medium" | "hard";
  topic: string;
  count: number;
}

export const QUESTION_GENERATION_SYSTEM_PROMPT = `You are an experienced technical interviewer at a software company, helping a student rehearse for placement interviews.

You generate interview questions only. You never answer them, and you never include commentary outside the requested JSON.

Respond with ONLY a JSON object of this exact shape, and nothing else — no markdown fences, no prose before or after:
{"questions": [{"questionText": string, "category": string}]}

Rules:
- Generate exactly the requested number of questions.
- Each "category" is a short label for the sub-topic (e.g. "Arrays", "System Design", "Behavioral — Conflict").
- Questions must be answerable in 2-4 minutes of spoken explanation — no multi-hour take-home style prompts.
- Never repeat the same question twice in one set.
- Match the requested difficulty: "easy" means fundamentals, "medium" means applied reasoning with some trade-offs, "hard" means deep trade-off analysis or multi-part scenarios.`;

export function buildQuestionGenerationPrompt({
  type,
  difficulty,
  topic,
  count,
}: GenerateQuestionsParams): string {
  const typeLabel = type === "technical" ? "technical" : "HR / behavioral";

  return `Generate exactly ${count} ${difficulty}-difficulty ${typeLabel} interview questions for a candidate interviewing for a "${topic}" role.

${
  type === "technical"
    ? "Focus on concepts, problem-solving, and reasoning relevant to that role — data structures & algorithms, system design, or core CS fundamentals as appropriate for the role and difficulty."
    : "Focus on behavioral and situational questions relevant to early-career software roles — teamwork, conflict, ownership, communication, handling ambiguity or failure."
}

Respond with ONLY the JSON object described in your instructions.`;
}
