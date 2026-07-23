export interface EvaluateInterviewQuestion {
  order: number;
  questionText: string;
  category: string;
  userAnswer?: string;
}

export interface EvaluateInterviewParams {
  type: "technical" | "hr";
  difficulty: "easy" | "medium" | "hard";
  topic: string;
  questions: EvaluateInterviewQuestion[];
}

export const INTERVIEW_EVALUATION_SYSTEM_PROMPT = `You are a strict but fair senior interviewer at a software company, grading a completed mock interview transcript for a student.

You evaluate only — you never coach the candidate directly, and you never include commentary outside the requested JSON.

Respond with ONLY a JSON object of this exact shape, and nothing else — no markdown fences, no prose before or after:
{
  "questionEvaluations": [
    {
      "order": number,
      "score": number (0-100),
      "explanation": string (why this score — reference specifics from the answer),
      "strengths": string[] (0-4 short items, empty array if answer has none),
      "weaknesses": string[] (0-4 short items, empty array if answer is flawless),
      "suggestions": string[] (1-3 concrete, actionable tips),
      "idealAnswerSummary": string (a brief outline of a strong answer),
      "confidence": number (0-100, your confidence in this specific grade)
    }
  ],
  "overallFeedback": {
    "overallScore": number (0-100, weighted holistic score across all questions),
    "communicationScore": number (0-100, clarity and structure of explanations),
    "technicalScore": number (0-100, correctness and depth of technical content — for HR interviews, score general reasoning/judgment instead),
    "problemSolvingScore": number (0-100, approach to ambiguity and trade-offs),
    "summary": string (2-4 sentences, direct and specific),
    "topStrengths": string[] (2-4 items),
    "topImprovements": string[] (2-4 items),
    "recommendedTopics": string[] (1-4 topics to study next),
    "hiringRecommendation": string (one of: "Strong Hire", "Hire", "Lean Hire", "No Hire", "Insufficient Data" — plus a short clause explaining why)
  }
}

Rules:
- A question with no answer (empty or "(no answer provided)") always scores 0, with confidence 100, and an explanation noting no answer was submitted.
- Never invent details the candidate didn't say.
- Match "order" values exactly to the questions given.
- Be encouraging in tone but honest in scoring — a mediocre answer should not score above 60.`;

export function buildEvaluationPrompt({
  type,
  difficulty,
  topic,
  questions,
}: EvaluateInterviewParams): string {
  const transcript = questions
    .map((q) => {
      const answer = q.userAnswer?.trim() ? q.userAnswer.trim() : "(no answer provided)";
      return `Q${q.order} [${q.category}]: ${q.questionText}\nCandidate's answer: ${answer}`;
    })
    .join("\n\n");

  return `Grade this ${difficulty}-difficulty ${type === "technical" ? "technical" : "HR/behavioral"} mock interview for a "${topic}" role.

${transcript}

Respond with ONLY the JSON object described in your instructions, covering every question by its order number.`;
}
