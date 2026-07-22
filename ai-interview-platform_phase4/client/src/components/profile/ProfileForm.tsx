"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { useProfile } from "@/hooks/useProfile";
import { updateProfileSchema, type UpdateProfileFormValues } from "@/lib/validators/auth";
import type { User } from "@/types/user";
import { cn } from "@/lib/utils";

const EXPERIENCE_LEVELS = [
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
] as const;

export function ProfileForm({ user }: { user: User }) {
  const { updateProfile, isUpdatingProfile } = useProfile();
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
  } = useForm<UpdateProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: user.name,
      bio: user.bio ?? "",
      targetRole: user.targetRole ?? "",
      experienceLevel: user.experienceLevel,
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    await updateProfile({
      name: values.name,
      bio: values.bio || undefined,
      targetRole: values.targetRole || undefined,
      experienceLevel: values.experienceLevel,
    });
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile details</CardTitle>
        <CardDescription>This personalizes the questions the AI generates for you.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={onSubmit} noValidate className="flex flex-col gap-4">
          <Input label="Full name" error={errors.name?.message} {...register("name")} />

          <Input
            label="Target role"
            placeholder="e.g. Frontend Developer"
            error={errors.targetRole?.message}
            {...register("targetRole")}
          />

          <div className="flex flex-col gap-1.5">
            <label htmlFor="experienceLevel" className="text-sm font-medium text-ink">
              Experience level
            </label>
            <select
              id="experienceLevel"
              className={cn(
                "h-11 w-full rounded-md border border-border bg-surface px-3.5 text-sm text-ink",
                "transition-colors focus:border-cobalt focus:outline-none focus:ring-2 focus:ring-cobalt/20",
              )}
              {...register("experienceLevel")}
            >
              {EXPERIENCE_LEVELS.map((level) => (
                <option key={level.value} value={level.value}>
                  {level.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="bio" className="text-sm font-medium text-ink">
              Bio
            </label>
            <textarea
              id="bio"
              rows={3}
              placeholder="A couple lines about where you're at and what you're prepping for."
              className={cn(
                "w-full resize-none rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/60",
                "transition-colors focus:border-cobalt focus:outline-none focus:ring-2 focus:ring-cobalt/20",
              )}
              {...register("bio")}
            />
            {errors.bio && <p className="text-xs text-coral">{errors.bio.message}</p>}
          </div>

          <Button
            type="submit"
            variant="cobalt"
            className="mt-1 self-start"
            isLoading={isUpdatingProfile}
            disabled={!isDirty}
          >
            Save changes
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
