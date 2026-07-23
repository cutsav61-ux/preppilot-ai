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
  mistakes: string[];
  keyConceptsMissed: string[];
  difficultyEstimate: Difficulty;
  followUpQuestions: string[];
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
  confidenceScore: number;
  answerQuality: number;
  summary: string;
  topStrengths: string[];
  topImprovements: string[];
  recommendedTopics: string[];
  studyPlan: string[];
  hiringRecommendation: string;
  companyReadiness: string;
}

export interface Interview {
  id: string;
  userId: string;
  type: InterviewType;
  topic: string;
  company?: string;
  difficulty: Difficulty;
  status: InterviewStatus;
  questions: InterviewQuestion[];
  overallFeedback?: OverallFeedback;
  startedAt: string;
  completedAt?: string;
  durationSeconds?: number;
}
