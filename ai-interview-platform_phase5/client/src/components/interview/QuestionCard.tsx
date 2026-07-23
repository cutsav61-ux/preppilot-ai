"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import type { InterviewQuestion } from "@/types/interview";

export function QuestionCard({ question }: { question: InterviewQuestion }) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="pt-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={question.order}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs uppercase tracking-wide text-ink-soft">
                Q{question.order}
              </span>
              <Badge variant="cobalt">{question.category}</Badge>
            </div>
            <p className="mt-3 text-lg leading-relaxed text-ink">{question.questionText}</p>
          </motion.div>
        </AnimatePresence>
      </CardContent>
    </Card>
  );
}
