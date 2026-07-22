export type ExperienceLevel = "beginner" | "intermediate" | "advanced";
export type InterviewType = "technical" | "hr";
export type Difficulty = "easy" | "medium" | "hard";
export type ThemePreference = "light" | "dark" | "system";

export interface UserSettings {
  theme: ThemePreference;
  emailNotifications: boolean;
  defaultInterviewType?: InterviewType;
  defaultDifficulty?: Difficulty;
}

export interface UserStats {
  totalInterviews: number;
  avgScore: number;
  currentStreak: number;
  lastInterviewAt: string | null;
}

export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  role: "student" | "admin";
  targetRole?: string;
  experienceLevel: ExperienceLevel;
  bio?: string;
  settings: UserSettings;
  stats: UserStats;
  createdAt: string;
}
