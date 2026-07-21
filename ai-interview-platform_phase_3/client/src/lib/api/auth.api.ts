import { apiClient, publicApiClient } from "@/lib/apiClient";
import type { User } from "@/types/user";

interface AuthResponse {
  user: User;
  accessToken: string;
}

export const authApi = {
  signup: (input: { name: string; email: string; password: string }) =>
    publicApiClient.post<AuthResponse>("/auth/signup", input),

  login: (input: { email: string; password: string }) =>
    publicApiClient.post<AuthResponse>("/auth/login", input),

  refresh: () => publicApiClient.post<AuthResponse>("/auth/refresh"),

  logout: () => apiClient.post<null>("/auth/logout"),

  me: () => apiClient.get<{ user: User }>("/auth/me"),

  forgotPassword: (email: string) =>
    publicApiClient.post<null>("/auth/forgot-password", { email }),

  resetPassword: (input: { token: string; password: string }) =>
    publicApiClient.post<null>("/auth/reset-password", input),
};
