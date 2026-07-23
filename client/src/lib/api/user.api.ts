import { apiClient } from "@/lib/apiClient";
import { API_BASE_URL } from "@/lib/constants";
import { useAuthStore } from "@/store/authStore";
import type { User } from "@/types/user";

export interface UserSession {
  id: string;
  deviceInfo: string;
  createdAt: string;
  expiresAt: string;
}

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

  updateSettings: (input: {
    theme?: "light" | "dark" | "system";
    emailNotifications?: boolean;
    defaultInterviewType?: "technical" | "hr";
    defaultDifficulty?: "easy" | "medium" | "hard";
  }) => apiClient.put<{ user: User }>("/users/settings", input),

  deleteAccount: (password: string) => apiClient.delete<null>("/users/account", { body: { password } }),

  getSessions: () => apiClient.get<{ sessions: UserSession[] }>("/users/sessions"),

  revokeSession: (sessionId: string) => apiClient.delete<null>(`/users/sessions/${sessionId}`),

  revokeAllSessions: () => apiClient.delete<null>("/users/sessions/all"),

  /** Not JSON — triggers a browser download of the user's data export. */
  exportData: async () => {
    const accessToken = useAuthStore.getState().accessToken;
    const response = await fetch(`${API_BASE_URL}/users/export-data`, {
      credentials: "include",
      headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
    });
    if (!response.ok) throw new Error("Couldn't export your data. Please try again.");

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "my-data-export.json";
    document.body.appendChild(link);
    link.click();
    link.remove();
    window.URL.revokeObjectURL(url);
  },
};
