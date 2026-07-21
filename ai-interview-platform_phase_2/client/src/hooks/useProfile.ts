"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { userApi } from "@/lib/api/user.api";
import { useAuthStore } from "@/store/authStore";
import { ApiError } from "@/lib/apiClient";

const PROFILE_QUERY_KEY = ["profile"] as const;

function getErrorMessage(error: unknown, fallback: string) {
  return error instanceof ApiError ? error.message : fallback;
}

export function useProfile() {
  const setSession = useAuthStore((state) => state.setSession);
  const accessToken = useAuthStore((state) => state.accessToken);
  const queryClient = useQueryClient();

  const profileQuery = useQuery({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: () => userApi.getProfile(),
    enabled: Boolean(accessToken),
  });

  const updateProfileMutation = useMutation({
    mutationFn: userApi.updateProfile,
    onSuccess: ({ user }) => {
      if (accessToken) setSession(user, accessToken);
      queryClient.setQueryData(PROFILE_QUERY_KEY, { user });
      toast.success("Profile updated.");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Couldn't update your profile. Please try again."));
    },
  });

  const changePasswordMutation = useMutation({
    mutationFn: userApi.changePassword,
    onSuccess: () => {
      toast.success("Password changed. You'll need to log in again on other devices.");
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, "Couldn't change your password. Please try again."));
    },
  });

  return {
    profile: profileQuery.data?.user,
    isLoading: profileQuery.isLoading,
    isError: profileQuery.isError,
    updateProfile: updateProfileMutation.mutateAsync,
    isUpdatingProfile: updateProfileMutation.isPending,
    changePassword: changePasswordMutation.mutateAsync,
    isChangingPassword: changePasswordMutation.isPending,
  };
}
