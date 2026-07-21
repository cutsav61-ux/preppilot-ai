import type { Difficulty, InterviewType } from "@/types/user";

export type InterviewStatus = "in_progress" | "completed" | "abandoned";

export interface QuestionEvaluation {
  score: number;
  strengths: string[];
  weaknesses: string[];
  suggestions: string[];
  idealAnswerSummary: string;
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
  summary: string;
  topStrengths: string[];
  topImprovements: string[];
  recommendedTopics: string[];
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
