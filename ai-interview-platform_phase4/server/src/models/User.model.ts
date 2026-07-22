import { Schema, model, Document, Types } from "mongoose";
import {
  DIFFICULTIES,
  EXPERIENCE_LEVELS,
  INTERVIEW_TYPES,
  USER_ROLES,
} from "../config/constants";

export interface UserDocument extends Document {
  _id: Types.ObjectId;
  name: string;
  email: string;
  password: string;
  avatarUrl?: string;
  role: "student" | "admin";
  targetRole?: string;
  experienceLevel: "beginner" | "intermediate" | "advanced";
  bio?: string;
  settings: {
    theme: "light" | "dark" | "system";
    emailNotifications: boolean;
    defaultInterviewType?: "technical" | "hr";
    defaultDifficulty?: "easy" | "medium" | "hard";
  };
  stats: {
    totalInterviews: number;
    avgScore: number;
    currentStreak: number;
    lastInterviewAt: Date | null;
  };
  isEmailVerified: boolean;
  passwordResetTokenHash?: string;
  passwordResetExpires?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<UserDocument>(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: { type: String, required: true, select: false },
    avatarUrl: { type: String },
    role: { type: String, enum: USER_ROLES, default: "student" },
    targetRole: { type: String, trim: true, maxlength: 80 },
    experienceLevel: {
      type: String,
      enum: EXPERIENCE_LEVELS,
      default: "beginner",
    },
    bio: { type: String, maxlength: 500 },
    settings: {
      theme: { type: String, enum: ["light", "dark", "system"], default: "system" },
      emailNotifications: { type: Boolean, default: true },
      defaultInterviewType: { type: String, enum: INTERVIEW_TYPES },
      defaultDifficulty: { type: String, enum: DIFFICULTIES },
    },
    stats: {
      totalInterviews: { type: Number, default: 0 },
      avgScore: { type: Number, default: 0 },
      currentStreak: { type: Number, default: 0 },
      lastInterviewAt: { type: Date, default: null },
    },
    isEmailVerified: { type: Boolean, default: false },
    passwordResetTokenHash: { type: String, select: false },
    passwordResetExpires: { type: Date, select: false },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_doc, ret: Record<string, unknown>) => {
        ret.id = (ret._id as Types.ObjectId).toString();
        delete ret._id;
        delete ret.__v;
        delete ret.password;
        delete ret.passwordResetTokenHash;
        delete ret.passwordResetExpires;
        return ret;
      },
    },
  },
);

export const User = model<UserDocument>("User", userSchema);
