"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/Button";
import { authApi } from "@/lib/api/auth.api";
import { ApiError } from "@/lib/apiClient";
import { resetPasswordSchema, type ResetPasswordFormValues } from "@/lib/validators/auth";
import { ROUTES } from "@/lib/constants";

export function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormValues>({ resolver: zodResolver(resetPasswordSchema) });

  const mutation = useMutation({
    mutationFn: (values: ResetPasswordFormValues) =>
      authApi.resetPassword({ token: token ?? "", password: values.password }),
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values));

  if (!token) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-md border border-border bg-surface p-6 text-center">
        <span className="flex size-10 items-center justify-center rounded-full bg-coral-soft text-coral">
          <AlertTriangle className="size-5" />
        </span>
        <p className="text-sm text-ink">This reset link is missing its token.</p>
        <Link href={ROUTES.forgotPassword} className="text-xs font-medium text-cobalt">
          Request a new link
        </Link>
      </div>
    );
  }

  return (
    <AnimatePresence mode="wait">
      {mutation.isSuccess ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex flex-col items-center gap-3 rounded-md border border-border bg-surface p-6 text-center"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-amber-soft text-amber">
            <CheckCircle2 className="size-5" />
          </span>
          <p className="text-sm text-ink">Your password has been updated.</p>
          <Link href={ROUTES.login}>
            <Button variant="cobalt" size="sm" className="mt-1">
              Log in
            </Button>
          </Link>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          onSubmit={onSubmit}
          noValidate
          className="flex flex-col gap-4"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          {mutation.isError && (
            <p className="rounded-md bg-coral-soft px-3 py-2 text-xs text-coral">
              {mutation.error instanceof ApiError
                ? mutation.error.message
                : "Something went wrong. Please try again."}
            </p>
          )}
          <PasswordInput
            label="New password"
            placeholder="At least 8 characters"
            hint={errors.password ? undefined : "Include a letter and a number"}
            error={errors.password?.message}
            {...register("password")}
          />
          <PasswordInput
            label="Confirm new password"
            placeholder="Re-enter your new password"
            error={errors.confirmPassword?.message}
            {...register("confirmPassword")}
          />
          <Button
            type="submit"
            variant="cobalt"
            className="mt-2 w-full"
            isLoading={mutation.isPending}
          >
            Reset password
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
