"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/Button";
import { useProfile } from "@/hooks/useProfile";
import { changePasswordSchema, type ChangePasswordFormValues } from "@/lib/validators/auth";

export function ChangePasswordCard() {
  const { changePassword, isChangingPassword } = useProfile();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ChangePasswordFormValues>({ resolver: zodResolver(changePasswordSchema) });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await changePassword({
        currentPassword: values.currentPassword,
        newPassword: values.newPassword,
      });
      reset();
    } catch {
      // Error toast is handled inside useProfile's onError — nothing else to do here.
    }
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Password</CardTitle>
        <CardDescription>Changing your password logs you out on every other device.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
          <PasswordInput
            label="Current password"
            error={errors.currentPassword?.message}
            {...register("currentPassword")}
          />
          <PasswordInput
            label="New password"
            hint={errors.newPassword ? undefined : "Include a letter and a number"}
            error={errors.newPassword?.message}
            {...register("newPassword")}
          />
          <PasswordInput
            label="Confirm new password"
            error={errors.confirmNewPassword?.message}
            {...register("confirmNewPassword")}
          />
          <Button
            type="submit"
            variant="outline"
            className="mt-1 self-start"
            isLoading={isChangingPassword}
          >
            Update password
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
