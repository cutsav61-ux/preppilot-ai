"use client";

import { useAuthStore } from "@/store/authStore";
import { useAuthContext } from "@/providers/AuthProvider";

/**
 * Phase 0 foundation only.
 * Returns the current client-side session state. `login`, `signup`, and
 * `logout` are added in Phase 1 once `/api/v1/auth/*` exists — they will
 * call the API, update `authStore`, and redirect via the router.
 */
export function useAuth() {
  const { isAuthenticated, isLoading } = useAuthContext();
  const user = useAuthStore((state) => state.user);

  return { user, isAuthenticated, isLoading };
}
