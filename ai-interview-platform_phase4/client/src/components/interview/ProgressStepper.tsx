"use client";

import { Check } from "lucide-react";
import { ProgressBar } from "@/components/ui/ProgressBar";
import { cn } from "@/lib/utils";
import type { InterviewQuestion } from "@/types/interview";

export function ProgressStepper({
  questions,
  currentIndex,
  onJump,
}: {
  questions: InterviewQuestion[];
  currentIndex: number;
  onJump: (index: number) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-ink">
          Question {currentIndex + 1} of {questions.length}
        </p>
        <div className="flex gap-1.5">
          {questions.map((question, index) => {
            const isAnswered = Boolean(question.userAnswer);
            const isCurrent = index === currentIndex;
            return (
              <button
                key={question.order}
                type="button"
                onClick={() => onJump(index)}
                aria-label={`Go to question ${index + 1}`}
                aria-current={isCurrent}
                className={cn(
                  "flex size-6 items-center justify-center rounded-full border text-[10px] font-medium transition-colors",
                  isCurrent
                    ? "border-cobalt bg-cobalt text-white"
                    : isAnswered
                      ? "border-amber bg-amber-soft text-amber"
                      : "border-border text-ink-soft hover:border-cobalt/40",
                )}
              >
                {isAnswered && !isCurrent ? <Check className="size-3" /> : index + 1}
              </button>
            );
          })}
        </div>
      </div>
      <ProgressBar value={currentIndex + 1} max={questions.length} />
    </div>
  );
}
