import { apiClient } from "@/lib/apiClient";
import type { User } from "@/types/user";

export const userApi = {
  getProfile: () => apiClient.get<{ user: User }>("/users/profile"),

  updateProfile: (input: {
    name?: string;
    bio?: string;
    targetRole?: string;
    experienceLevel?: "beginner" | "intermediate" | "advanced";
  }) => apiClient.put<{ user: User }>("/users/profile", input),

  changePassword: (input: { currentPassword: string; newPassword: string }) =>
    apiClient.put<null>("/users/password", input),
};
