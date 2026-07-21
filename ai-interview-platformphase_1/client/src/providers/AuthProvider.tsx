"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { useAuthStore } from "@/store/authStore";
import { authApi } from "@/lib/api/auth.api";
import { ApiError } from "@/lib/apiClient";

interface AuthContextValue {
  isAuthenticated: boolean;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextValue>({
  isAuthenticated: false,
  isLoading: true,
});

/**
 * On mount, silently attempts POST /auth/refresh. Since the access token
 * only lives in memory (Zustand), it's gone after a hard refresh — but the
 * httpOnly refresh cookie survives, so this call re-establishes the
 * session without the user noticing. A 401 here just means "logged out",
 * not an error worth surfacing.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const user = useAuthStore((state) => state.user);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    authApi
      .refresh()
      .then(({ user: freshUser, accessToken }) => {
        if (!cancelled) setSession(freshUser, accessToken);
      })
      .catch((error) => {
        if (!cancelled && !(error instanceof ApiError && error.status === 401)) {
          // eslint-disable-next-line no-console
          console.error("Session bootstrap failed:", error);
        }
        if (!cancelled) clearSession();
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={{ isAuthenticated: Boolean(user), isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuthContext() {
  return useContext(AuthContext);
}
