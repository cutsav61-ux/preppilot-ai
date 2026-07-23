"use client";

import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { TypeSelector } from "@/components/interview/TypeSelector";
import { DifficultySelector } from "@/components/interview/DifficultySelector";
import { TopicSelector } from "@/components/interview/TopicSelector";
import { useInterviewActions } from "@/hooks/useInterview";
import { useProfile } from "@/hooks/useProfile";
import { interviewSetupSchema, type InterviewSetupFormValues } from "@/lib/validators/interview";
import { cn } from "@/lib/utils";

const QUESTION_COUNTS = [3, 5, 7, 10];

export function SetupWizard() {
  const { createInterview, isCreating } = useInterviewActions();
  const { profile } = useProfile();

  const {
    control,
    handleSubmit,
    register,
    setValue,
    watch,
    formState: { errors },
  } = useForm<InterviewSetupFormValues>({
    resolver: zodResolver(interviewSetupSchema),
    defaultValues: { type: "technical", difficulty: "medium", topic: "", company: "", numQuestions: 5 },
  });

  const numQuestions = watch("numQuestions");

  useEffect(() => {
    if (profile?.targetRole) {
      setValue("topic", profile.targetRole);
    }
  }, [profile?.targetRole, setValue]);

  const onSubmit = handleSubmit(async (values) => {
    try {
      await createInterview(values);
    } catch {
      // Error toast is handled inside useInterviewActions' onError.
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mx-auto max-w-2xl"
    >
      <Card>
        <CardHeader>
          <CardTitle>Set up your interview</CardTitle>
          <CardDescription>
            Pick a type, difficulty, and role — the questions are generated for exactly that
            combination.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} noValidate className="flex flex-col gap-6">
            <div>
              <p className="mb-2 text-sm font-medium text-ink">Interview type</p>
              <Controller
                control={control}
                name="type"
                render={({ field }) => <TypeSelector value={field.value} onChange={field.onChange} />}
              />
              {errors.type && <p className="mt-1.5 text-xs text-coral">{errors.type.message}</p>}
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-ink">Difficulty</p>
              <Controller
                control={control}
                name="difficulty"
                render={({ field }) => (
                  <DifficultySelector value={field.value} onChange={field.onChange} />
                )}
              />
              {errors.difficulty && (
                <p className="mt-1.5 text-xs text-coral">{errors.difficulty.message}</p>
              )}
            </div>

            <div>
              <p className="mb-2 text-sm font-medium text-ink">Role</p>
              <Controller
                control={control}
                name="topic"
                render={({ field }) => (
                  <TopicSelector
                    value={field.value}
                    onChange={field.onChange}
                    error={errors.topic?.message}
                  />
                )}
              />
            </div>

            <Input
              label="Company (optional)"
              placeholder="e.g. Google, a specific startup, or leave blank"
              error={errors.company?.message}
              {...register("company")}
            />

            <div>
              <p className="mb-2 text-sm font-medium text-ink">Number of questions</p>
              <div className="flex gap-2">
                {QUESTION_COUNTS.map((count) => (
                  <button
                    key={count}
                    type="button"
                    onClick={() => setValue("numQuestions", count)}
                    className={cn(
                      "flex size-10 items-center justify-center rounded-md border text-sm font-medium transition-colors",
                      numQuestions === count
                        ? "border-cobalt bg-cobalt-soft text-cobalt"
                        : "border-border text-ink-soft hover:border-cobalt/40 hover:text-ink",
                    )}
                  >
                    {count}
                  </button>
                ))}
              </div>
            </div>

            <Button type="submit" variant="cobalt" size="lg" isLoading={isCreating} className="w-full">
              Generate interview
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
