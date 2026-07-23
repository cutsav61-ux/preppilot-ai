"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { userApi } from "@/lib/api/user.api";
import { useAuthStore } from "@/store/authStore";
import { ApiError } from "@/lib/apiClient";
import { ROUTES } from "@/lib/constants";

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback;
}

export function useUpdateSettings() {
  const setSession = useAuthStore((state) => state.setSession);
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: userApi.updateSettings,
    onSuccess: ({ user }) => {
      if (accessToken) setSession(user, accessToken);
      queryClient.setQueryData(["profile"], { user });
      toast.success("Settings updated.");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Couldn't update settings. Please try again."));
    },
  });
}

export function useSessions() {
  return useQuery({
    queryKey: ["sessions"],
    queryFn: () => userApi.getSessions(),
    select: (data) => data.sessions,
  });
}

export function useRevokeSession() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.revokeSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      toast.success("Session revoked.");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Couldn't revoke that session."));
    },
  });
}

export function useRevokeAllSessions() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: userApi.revokeAllSessions,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sessions"] });
      toast.success("Logged out everywhere. You'll need to log in again next time.");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Couldn't log out other sessions."));
    },
  });
}

export function useExportData() {
  return useMutation({
    mutationFn: userApi.exportData,
    onSuccess: () => toast.success("Your data export has started downloading."),
    onError: (error) => {
      toast.error(getErrorMessage(error, "Couldn't export your data. Please try again."));
    },
  });
}

export function useDeleteAccount() {
  const clearSession = useAuthStore((state) => state.clearSession);
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: userApi.deleteAccount,
    onSuccess: () => {
      clearSession();
      queryClient.clear();
      toast.success("Account deleted.");
      router.push(ROUTES.home);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Couldn't delete your account. Please try again."));
    },
  });
}
