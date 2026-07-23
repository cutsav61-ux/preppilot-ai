"use client";

import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { loginSchema, type LoginFormValues } from "@/lib/validators/auth";
import { ROUTES } from "@/lib/constants";

export function LoginForm() {
  const { login, isLoggingIn } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await login(values);
    } catch {
      // Error toast is handled inside useAuth's onError — nothing else to do here.
    }
  });

  return (
    <motion.form
      onSubmit={onSubmit}
      noValidate
      className="flex flex-col gap-4"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
    >
      <Input
        label="Email"
        type="email"
        placeholder="you@college.edu"
        error={errors.email?.message}
        {...register("email")}
      />
      <div>
        <PasswordInput
          label="Password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register("password")}
        />
        <Link
          href={ROUTES.forgotPassword}
          className="mt-2 inline-block text-xs font-medium text-cobalt"
        >
          Forgot password?
        </Link>
      </div>
      <Button type="submit" variant="cobalt" className="mt-2 w-full" isLoading={isLoggingIn}>
        Log in
      </Button>
    </motion.form>
  );
}
