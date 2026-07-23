import { Schema, model, Document, Types } from "mongoose";
import { DIFFICULTIES, INTERVIEW_STATUSES, INTERVIEW_TYPES } from "../config/constants";

export interface QuestionSubdocument {
  order: number;
  questionText: string;
  category: string;
  userAnswer?: string;
  answeredAt?: Date;
  timeTakenSeconds?: number;
  evaluation?: {
    score: number;
    explanation: string;
    strengths: string[];
    weaknesses: string[];
    suggestions: string[];
    idealAnswerSummary: string;
    confidence: number;
    mistakes: string[];
    keyConceptsMissed: string[];
    difficultyEstimate: "easy" | "medium" | "hard";
    followUpQuestions: string[];
  };
}

export interface InterviewDocument extends Document {
  _id: Types.ObjectId;
  userId: Types.ObjectId;
  type: "technical" | "hr";
  topic: string;
  company?: string;
  difficulty: "easy" | "medium" | "hard";
  status: "in_progress" | "completed" | "abandoned";
  questions: QuestionSubdocument[];
  overallFeedback?: {
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
  };
  startedAt: Date;
  completedAt?: Date;
  durationSeconds?: number;
  createdAt: Date;
  updatedAt: Date;
}

const evaluationSchema = new Schema(
  {
    score: Number,
    explanation: String,
    strengths: [String],
    weaknesses: [String],
    suggestions: [String],
    idealAnswerSummary: String,
    confidence: Number,
    mistakes: [String],
    keyConceptsMissed: [String],
    difficultyEstimate: { type: String, enum: DIFFICULTIES },
    followUpQuestions: [String],
  },
  { _id: false },
);

const questionSchema = new Schema<QuestionSubdocument>(
  {
    order: { type: Number, required: true },
    questionText: { type: String, required: true },
    category: { type: String, required: true },
    userAnswer: { type: String },
    answeredAt: { type: Date },
    timeTakenSeconds: { type: Number },
    evaluation: { type: evaluationSchema, required: false },
  },
  { _id: false },
);

const interviewSchema = new Schema<InterviewDocument>(
  {
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: { type: String, enum: INTERVIEW_TYPES, required: true },
    topic: { type: String, required: true, trim: true },
    company: { type: String, trim: true, maxlength: 100 },
    difficulty: { type: String, enum: DIFFICULTIES, required: true },
    status: { type: String, enum: INTERVIEW_STATUSES, default: "in_progress", index: true },
    questions: { type: [questionSchema], default: [] },
    overallFeedback: {
      overallScore: Number,
      communicationScore: Number,
      technicalScore: Number,
      problemSolvingScore: Number,
      confidenceScore: Number,
      answerQuality: Number,
      summary: String,
      topStrengths: [String],
      topImprovements: [String],
      recommendedTopics: [String],
      studyPlan: [String],
      hiringRecommendation: String,
      companyReadiness: String,
    },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
    durationSeconds: { type: Number },
  },
  {
    timestamps: true,
    toJSON: {
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = (ret._id as Types.ObjectId).toString();
        delete ret._id;
        delete ret.__v;
        return ret;
      },
    },
  },
);

interviewSchema.index({ userId: 1, createdAt: -1 });
interviewSchema.index({ userId: 1, status: 1 });
interviewSchema.index({ userId: 1, topic: 1 });
interviewSchema.index({ userId: 1, company: 1 });
interviewSchema.index({ userId: 1, status: 1, completedAt: -1 });

export const Interview = model<InterviewDocument>("Interview", interviewSchema);
