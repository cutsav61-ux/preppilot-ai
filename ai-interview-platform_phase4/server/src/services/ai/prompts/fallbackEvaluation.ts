import type { EvaluateInterviewQuestion } from "./evaluateInterview.prompt";

export interface FallbackQuestionEvaluation {
  order: number;
  score: number;
  explanation: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  idealAnswerSummary: string;
  confidence: number;
}

export interface FallbackOverallFeedback {
  overallScore: number;
  communicationScore: number;
  technicalScore: number;
  problemSolvingScore: number;
  summary: string;
  topStrengths: string[];
  topImprovements: string[];
  recommendedTopics: string[];
  hiringRecommendation: string;
}

/**
 * Not a real evaluation — a transparent placeholder used only when the AI
 * call fails outright. Explicitly labeled as such in every field so it's
 * never mistaken for genuine feedback.
 */
export function getFallbackEvaluation(questions: EvaluateInterviewQuestion[]): {
  questionEvaluations: FallbackQuestionEvaluation[];
  overallFeedback: FallbackOverallFeedback;
} {
  const questionEvaluations = questions.map((q): FallbackQuestionEvaluation => {
    const hasAnswer = Boolean(q.userAnswer?.trim());

    if (!hasAnswer) {
      return {
        order: q.order,
        score: 0,
        explanation: "No answer was submitted for this question.",
        strengths: [],
        weaknesses: ["No answer submitted"],
        suggestions: ["Answer every question to receive a score."],
        idealAnswerSummary: "",
        confidence: 100,
      };
    }

    const lengthBasedScore = Math.min(75, 40 + Math.floor(q.userAnswer!.trim().length / 20));

    return {
      order: q.order,
      score: lengthBasedScore,
      explanation:
        "AI evaluation was temporarily unavailable, so this is a baseline estimate based on answer completeness rather than content quality.",
      strengths: ["Submitted a complete answer"],
      weaknesses: ["Detailed content feedback requires the AI evaluator, which was unavailable"],
      suggestions: ["Re-run evaluation later for a full AI-graded critique of this answer."],
      idealAnswerSummary: "Not available — AI evaluation was unavailable for this session.",
      confidence: 20,
    };
  });

  const answeredScores = questionEvaluations.filter((q) => q.score > 0).map((q) => q.score);
  const overallScore = answeredScores.length
    ? Math.round(answeredScores.reduce((sum, s) => sum + s, 0) / questionEvaluations.length)
    : 0;

  return {
    questionEvaluations,
    overallFeedback: {
      overallScore,
      communicationScore: overallScore,
      technicalScore: overallScore,
      problemSolvingScore: overallScore,
      summary:
        "AI evaluation was unavailable when this interview was completed, so these are baseline placeholder scores rather than in-depth feedback.",
      topStrengths: [],
      topImprovements: ["Re-run evaluation once the AI service is available for real feedback."],
      recommendedTopics: [],
      hiringRecommendation: "Insufficient Data — AI evaluation was unavailable.",
    },
  };
}
