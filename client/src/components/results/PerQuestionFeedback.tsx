"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, CheckCircle2, AlertTriangle } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";
import type { InterviewQuestion } from "@/types/interview";

function scoreVariant(score: number): "cobalt" | "amber" | "coral" {
  if (score >= 75) return "cobalt";
  if (score >= 50) return "amber";
  return "coral";
}

function QuestionFeedbackItem({ question }: { question: InterviewQuestion }) {
  const [open, setOpen] = useState(false);
  const evaluation = question.evaluation;

  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-3 p-4 text-left"
        aria-expanded={open}
      >
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs uppercase tracking-wide text-ink-soft">
              Q{question.order}
            </span>
            <Badge variant="neutral">{question.category}</Badge>
          </div>
          <p className="mt-1 truncate text-sm font-medium text-ink">{question.questionText}</p>
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {evaluation && (
            <Badge variant={scoreVariant(evaluation.score)}>{evaluation.score}/100</Badge>
          )}
          <ChevronDown className={cn("size-4 text-ink-soft transition-transform", open && "rotate-180")} />
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && evaluation && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            className="overflow-hidden border-t border-border"
          >
            <div className="flex flex-col gap-4 p-4">
              <div>
                <p className="rounded-md border border-border bg-paper p-3 text-sm text-ink-soft">
                  {question.userAnswer || "No answer recorded."}
                </p>
              </div>

              <p className="text-sm text-ink">{evaluation.explanation}</p>

              {evaluation.strengths.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  {evaluation.strengths.map((s) => (
                    <div key={s} className="flex items-start gap-2 text-sm text-ink-soft">
                      <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-cobalt" />
                      {s}
                    </div>
                  ))}
                </div>
              )}

              {evaluation.weaknesses.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  {evaluation.weaknesses.map((w) => (
                    <div key={w} className="flex items-start gap-2 text-sm text-ink-soft">
                      <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-coral" />
                      {w}
                    </div>
                  ))}
                </div>
              )}

              {evaluation.mistakes.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <p className="text-xs font-medium uppercase tracking-wide text-coral">
                    Mistakes
                  </p>
                  {evaluation.mistakes.map((m) => (
                    <div key={m} className="flex items-start gap-2 text-sm text-ink-soft">
                      <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-coral" />
                      {m}
                    </div>
                  ))}
                </div>
              )}

              {evaluation.keyConceptsMissed.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
                    Key concepts missed
                  </p>
                  <div className="flex flex-wrap gap-1.5">
                    {evaluation.keyConceptsMissed.map((concept) => (
                      <Badge key={concept} variant="neutral">
                        {concept}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {evaluation.idealAnswerSummary && (
                <div className="rounded-md bg-amber-soft p-3 text-sm text-ink">
                  <p className="mb-1 text-xs font-medium uppercase tracking-wide text-amber">
                    A stronger answer would...
                  </p>
                  {evaluation.idealAnswerSummary}
                </div>
              )}

              {evaluation.followUpQuestions.length > 0 && (
                <div className="flex flex-col gap-1.5">
                  <p className="text-xs font-medium uppercase tracking-wide text-ink-soft">
                    A real interviewer might follow up with...
                  </p>
                  {evaluation.followUpQuestions.map((q) => (
                    <p key={q} className="text-sm italic text-ink-soft">
                      "{q}"
                    </p>
                  ))}
                </div>
              )}

              <p className="text-xs text-ink-soft">
                AI confidence in this grade: {evaluation.confidence}% · Estimated question
                difficulty: {evaluation.difficultyEstimate}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </Card>
  );
}

export function PerQuestionFeedback({ questions }: { questions: InterviewQuestion[] }) {
  return (
    <div className="flex flex-col gap-3">
      {questions.map((question) => (
        <QuestionFeedbackItem key={question.order} question={question} />
      ))}
    </div>
  );
}
