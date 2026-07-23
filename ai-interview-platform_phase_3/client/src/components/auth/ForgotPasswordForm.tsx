"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { motion, AnimatePresence } from "framer-motion";
import { MailCheck } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { authApi } from "@/lib/api/auth.api";
import { ApiError } from "@/lib/apiClient";
import { forgotPasswordSchema, type ForgotPasswordFormValues } from "@/lib/validators/auth";
import { toast } from "sonner";

export function ForgotPasswordForm() {
  const [submittedEmail, setSubmittedEmail] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormValues>({ resolver: zodResolver(forgotPasswordSchema) });

  const mutation = useMutation({
    mutationFn: authApi.forgotPassword,
    onSuccess: (_, email) => setSubmittedEmail(email),
    onError: (error) => {
      toast.error(
        error instanceof ApiError ? error.message : "Something went wrong. Please try again.",
      );
    },
  });

  const onSubmit = handleSubmit((values) => mutation.mutate(values.email));

  return (
    <AnimatePresence mode="wait">
      {submittedEmail ? (
        <motion.div
          key="confirmation"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="flex flex-col items-center gap-3 rounded-md border border-border bg-surface p-6 text-center"
        >
          <span className="flex size-10 items-center justify-center rounded-full bg-cobalt-soft text-cobalt">
            <MailCheck className="size-5" />
          </span>
          <p className="text-sm text-ink">
            If an account exists for <span className="font-medium">{submittedEmail}</span>,
            you'll get a reset link shortly.
          </p>
          <p className="text-xs text-ink-soft">Check your spam folder if it doesn't show up.</p>
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
          <Input
            label="Email"
            type="email"
            placeholder="you@college.edu"
            error={errors.email?.message}
            {...register("email")}
          />
          <Button type="submit" variant="cobalt" className="mt-2 w-full" isLoading={mutation.isPending}>
            Send reset link
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
