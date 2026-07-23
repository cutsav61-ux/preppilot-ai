import type { Difficulty, InterviewType } from "@/types/user";

export type InterviewStatus = "in_progress" | "completed" | "abandoned";

export interface QuestionEvaluation {
  score: number;
  explanation: string;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  idealAnswerSummary: string;
  confidence: number;
}

export interface InterviewQuestion {
  order: number;
  questionText: string;
  category: string;
  userAnswer?: string;
  answeredAt?: string;
  timeTakenSeconds?: number;
  evaluation?: QuestionEvaluation;
}

export interface OverallFeedback {
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

export interface Interview {
  id: string;
  userId: string;
  type: InterviewType;
  topic: string;
  difficulty: Difficulty;
  status: InterviewStatus;
  questions: InterviewQuestion[];
  overallFeedback?: OverallFeedback;
  startedAt: string;
  completedAt?: string;
  durationSeconds?: number;
}
