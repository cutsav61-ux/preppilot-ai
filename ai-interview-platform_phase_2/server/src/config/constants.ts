export const API_PREFIX = "/api/v1";

export const INTERVIEW_TYPES = ["technical", "hr"] as const;
export const DIFFICULTIES = ["easy", "medium", "hard"] as const;
export const INTERVIEW_STATUSES = ["in_progress", "completed", "abandoned"] as const;
export const EXPERIENCE_LEVELS = ["beginner", "intermediate", "advanced"] as const;
export const USER_ROLES = ["student", "admin"] as const;

export const BCRYPT_SALT_ROUNDS = 12;

export const PASSWORD_RESET_TOKEN_EXPIRY_MINUTES = 30;

export const REFRESH_TOKEN_COOKIE_NAME = "refresh_token";
