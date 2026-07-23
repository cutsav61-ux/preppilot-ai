"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useAuthStore } from "@/store/authStore";
import { useAuthContext } from "@/providers/AuthProvider";
import { authApi } from "@/lib/api/auth.api";
import { ApiError } from "@/lib/apiClient";
import { ROUTES } from "@/lib/constants";

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback;
}

export function useAuth() {
  const { isAuthenticated, isLoading } = useAuthContext();
  const user = useAuthStore((state) => state.user);
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);
  const router = useRouter();
  const queryClient = useQueryClient();

  const signupMutation = useMutation({
    mutationFn: authApi.signup,
    onSuccess: ({ user: newUser, accessToken }) => {
      setSession(newUser, accessToken);
      toast.success(`Welcome, ${newUser.name.split(" ")[0]} — let's get you set up.`);
      router.push(ROUTES.profile);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Couldn't create your account. Please try again."));
    },
  });

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: ({ user: loggedInUser, accessToken }) => {
      setSession(loggedInUser, accessToken);
      toast.success(`Welcome back, ${loggedInUser.name.split(" ")[0]}.`);
      router.push(ROUTES.profile);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Couldn't log you in. Please try again."));
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSettled: () => {
      // Clear local session regardless of whether the API call succeeded —
      // an expired access token shouldn't trap the user in a logged-in UI.
      clearSession();
      queryClient.clear();
      toast.success("Logged out.");
      router.push(ROUTES.home);
    },
  });

  return {
    user,
    isAuthenticated,
    isLoading,
    signup: signupMutation.mutateAsync,
    isSigningUp: signupMutation.isPending,
    login: loginMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    logout: logoutMutation.mutate,
    isLoggingOut: logoutMutation.isPending,
  };
}
