"use client";

import { toast } from "sonner";
import { Input } from "@/components/ui/Input";
import { PasswordInput } from "@/components/auth/PasswordInput";
import { Button } from "@/components/ui/Button";

/**
 * Phase 0 foundation: renders the form and validates nothing yet.
 * Phase 1 replaces this with React Hook Form + Zod validation and a real
 * call to POST /api/v1/auth/login.
 */
export function LoginForm() {
  return (
    <form
      className="flex flex-col gap-4"
      onSubmit={(event) => {
        event.preventDefault();
        toast.info("Login isn't wired up yet — landing in Phase 1.");
      }}
    >
      <Input label="Email" name="email" type="email" placeholder="you@college.edu" required />
      <PasswordInput label="Password" name="password" placeholder="••••••••" required />
      <Button type="submit" variant="cobalt" className="mt-2 w-full">
        Log in
      </Button>
    </form>
  );
}
