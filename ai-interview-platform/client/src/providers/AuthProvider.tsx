"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { useAuthStore } from "@/store/authStore";

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  isLoading: false,
});

/**
 * Phase 0 foundation only. Right now this just exposes the client-side
 * auth store. Session hydration on load (calling GET /auth/me), token
 * refresh, and redirect-on-401 handling are wired up in Phase 1.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user);

  const value = useMemo<AuthContextValue>(
    () => ({
      isAuthenticated: Boolean(user),
      isLoading: false,
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext() {
  return useContext(AuthContext);
}
