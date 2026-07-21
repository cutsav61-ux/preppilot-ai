export const APP_NAME = process.env.NEXT_PUBLIC_APP_NAME ?? "AI Interview Platform";

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:5000/api/v1";

export const ROUTES = {
  home: "/",
  login: "/login",
  signup: "/signup",
  forgotPassword: "/forgot-password",
  resetPassword: "/reset-password",
  dashboard: "/dashboard",
  profile: "/profile",
  settings: "/settings",
  history: "/history",
  interviewNew: "/interview/new",
} as const;

export const INTERVIEW_TYPES = ["technical", "hr"] as const;
export const DIFFICULTIES = ["easy", "medium", "hard"] as const;
