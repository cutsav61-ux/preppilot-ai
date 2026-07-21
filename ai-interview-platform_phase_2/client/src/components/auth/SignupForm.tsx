"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";
import { signupSchema, type SignupFormValues } from "@/lib/validators/auth";

export function SignupForm() {
  const { signup, isSigningUp } = useAuth();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormValues>({ resolver: zodResolver(signupSchema) });

  const onSubmit = handleSubmit(async (values) => {
    try {
      await signup(values);
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
        label="Full name"
        placeholder="Priya Nair"
        error={errors.name?.message}
        {...register("name")}
      />
      <Input
        label="Email"
        type="email"
        placeholder="you@college.edu"
        error={errors.email?.message}
        {...register("email")}
      />
      <PasswordInput
        label="Password"
        placeholder="At least 8 characters"
        hint={errors.password ? undefined : "Include a letter and a number"}
        error={errors.password?.message}
        {...register("password")}
      />
      <Button type="submit" variant="cobalt" className="mt-2 w-full" isLoading={isSigningUp}>
        Create account
      </Button>
    </motion.form>
  );
}
