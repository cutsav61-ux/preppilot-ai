import { create } from "zustand";
import type { User } from "@/types/user";

interface AuthState {
  user: User | null;
  accessToken: string | null;
  setSession: (user: User, accessToken: string) => void;
  clearSession: () => void;
}

/**
 * Holds the in-memory auth session (access token + current user).
 * The refresh token itself never touches client state — it lives only in
 * the httpOnly cookie set by the server. Full login/logout/refresh flows
 * are implemented in Phase 1.
 */
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  setSession: (user, accessToken) => set({ user, accessToken }),
  clearSession: () => set({ user: null, accessToken: null }),
}));
