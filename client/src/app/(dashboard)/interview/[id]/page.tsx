"use client";

import { useEffect, useRef, useState } from "react";
import { useParams } from "next/navigation";
import { motion } from "framer-motion";
import { Flag, CheckCircle2, SkipForward } from "lucide-react";
import { useInterviewSession, useInterviewActions } from "@/hooks/useInterview";
import { useStopwatch } from "@/hooks/useStopwatch";
import { useSpeechSynthesis } from "@/hooks/useSpeechSynthesis";
import { useCountdownTimer } from "@/hooks/useCountdownTimer";
import { QuestionCard } from "@/components/interview/QuestionCard";
import { AnswerEditor } from "@/components/interview/AnswerEditor";
import { InterviewTimer } from "@/components/interview/InterviewTimer";
import { ProgressStepper } from "@/components/interview/ProgressStepper";
import { NavigationControls } from "@/components/interview/NavigationControls";
import { InterviewModeToggle, type InterviewMode } from "@/components/interview/InterviewModeToggle";
import { VoiceQuestionPlayer } from "@/components/interview/VoiceQuestionPlayer";
import { VoiceAnswerRecorder } from "@/components/interview/VoiceAnswerRecorder";
import { CountdownTimer } from "@/components/interview/CountdownTimer";
import { ScoreSummaryCard } from "@/components/results/ScoreSummaryCard";
import { RatingsGrid } from "@/components/results/RatingsGrid";
import { PerQuestionFeedback } from "@/components/results/PerQuestionFeedback";
import { ImprovementRoadmap } from "@/components/results/ImprovementRoadmap";
import { ExportReportButton } from "@/components/results/ExportReportButton";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Card, CardContent } from "@/components/ui/Card";
import { Modal } from "@/components/ui/Modal";
import { Skeleton } from "@/components/ui/Skeleton";
import { ROUTES } from "@/lib/constants";
import Link from "next/link";
import type { Interview } from "@/types/interview";

const VOICE_QUESTION_SECONDS = 120;

function findFirstUnansweredIndex(questions: { userAnswer?: string }[]): number {
  const index = questions.findIndex((q) => !q.userAnswer);
  return index === -1 ? 0 : index;
}

function LiveInterviewSkeleton() {
  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <Skeleton className="h-6 w-48" />
      <Skeleton className="h-32 w-full rounded-lg" />
      <Skeleton className="h-48 w-full rounded-lg" />
      <div className="flex justify-between">
        <Skeleton className="h-11 w-28 rounded-md" />
        <Skeleton className="h-11 w-28 rounded-md" />
      </div>
    </div>
  );
}

function PlainRecap({
  questions,
  topic,
  type,
}: {
  questions: { order: number; questionText: string; category: string; userAnswer?: string }[];
  topic: string;
  type: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mx-auto flex max-w-2xl flex-col gap-6"
    >
      <div className="flex flex-col items-center gap-3 rounded-lg border border-border bg-surface py-8 text-center">
        <span className="flex size-12 items-center justify-center rounded-full bg-amber-soft text-amber">
          <CheckCircle2 className="size-6" />
        </span>
        <div>
          <h1 className="font-display text-xl font-medium text-ink">Interview complete</h1>
          <p className="mt-1 text-sm text-ink-soft">
            {topic} · {type === "technical" ? "Technical" : "HR / Behavioral"}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {questions.map((question) => (
          <Card key={question.order}>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <span className="font-mono text-xs uppercase tracking-wide text-ink-soft">
                  Q{question.order}
                </span>
                <Badge variant="cobalt">{question.category}</Badge>
              </div>
              <p className="mt-2 text-sm font-medium text-ink">{question.questionText}</p>
              <p className="mt-3 whitespace-pre-wrap rounded-md border border-border bg-paper p-3 text-sm text-ink-soft">
                {question.userAnswer || "No answer recorded."}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <p className="text-center text-xs text-ink-soft">Scoring isn't available for this session.</p>

      <Link href={ROUTES.dashboard} className="self-center">
        <Button variant="cobalt">Back to dashboard</Button>
      </Link>
    </motion.div>
  );
}

const resultsContainer = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const resultsItem = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

function ResultsView({ interview }: { interview: Interview }) {
  // Defensive fallback: older/edge-case interviews may have ended without
  // AI feedback ever being generated (e.g. abandoned before Phase 4 shipped).
  if (!interview.overallFeedback) {
    return (
      <PlainRecap questions={interview.questions} topic={interview.topic} type={interview.type} />
    );
  }

  return (
    <motion.div
      variants={resultsContainer}
      initial="hidden"
      animate="show"
      className="mx-auto flex max-w-2xl flex-col gap-6"
    >
      <motion.div variants={resultsItem} className="text-center">
        <p className="font-mono text-xs uppercase tracking-wide text-ink-soft">
          {interview.topic}
          {interview.company ? ` · ${interview.company}` : ""} ·{" "}
          {interview.type === "technical" ? "Technical" : "HR / Behavioral"} · {interview.difficulty}
          {interview.durationSeconds
            ? ` · ${Math.round(interview.durationSeconds / 60)} min`
            : ""}
        </p>
      </motion.div>

      <motion.div variants={resultsItem}>
        <ScoreSummaryCard feedback={interview.overallFeedback} />
      </motion.div>

      <motion.div variants={resultsItem}>
        <RatingsGrid feedback={interview.overallFeedback} />
      </motion.div>

      <motion.div variants={resultsItem}>
        <ImprovementRoadmap feedback={interview.overallFeedback} />
      </motion.div>

      <motion.div variants={resultsItem}>
        <h2 className="mb-3 font-display text-lg font-medium text-ink">Per-question breakdown</h2>
        <PerQuestionFeedback questions={interview.questions} />
      </motion.div>

      <motion.div variants={resultsItem} className="flex flex-wrap justify-center gap-3">
        <ExportReportButton interviewId={interview.id} />
        <Link href={ROUTES.dashboard}>
          <Button variant="cobalt">Back to dashboard</Button>
        </Link>
      </motion.div>
    </motion.div>
  );
}

export default function LiveInterviewPage() {
  const params = useParams<{ id: string }>();
  const interviewId = params.id;
  const { data: interview, isLoading } = useInterviewSession(interviewId);
  const { submitAnswer, isSubmittingAnswer, completeInterview, isCompleting } =
    useInterviewActions();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answerDraft, setAnswerDraft] = useState("");
  const [hasInitialized, setHasInitialized] = useState(false);
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [mode, setMode] = useState<InterviewMode>("text");
  const [voiceApiSupported, setVoiceApiSupported] = useState(false);

  const { elapsedSeconds, getElapsedSeconds } = useStopwatch(currentIndex);
  const speech = useSpeechSynthesis();

  // handleNext is defined further down (after the early returns below, since
  // it depends on `interview` being loaded). This ref lets the countdown
  // timer — which must be called unconditionally, before any early return —
  // call the latest version of it once it exists, without violating the
  // Rules of Hooks.
  const handleNextRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    setVoiceApiSupported(Boolean(window.SpeechRecognition || window.webkitSpeechRecognition));
  }, []);

  // Seed the starting question once (resume at the first unanswered one).
  useEffect(() => {
    if (interview && !hasInitialized) {
      setCurrentIndex(findFirstUnansweredIndex(interview.questions));
      setHasInitialized(true);
    }
  }, [interview, hasInitialized]);

  const currentQuestion = interview?.questions[currentIndex];

  // Load the draft for whichever question is now current.
  useEffect(() => {
    setAnswerDraft(currentQuestion?.userAnswer ?? "");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentIndex, interview?.id]);

  // Voice mode's countdown auto-submits when time runs out. Only actually
  // acts once we're in the live in-progress voice session — otherwise a
  // no-op, since handleNextRef.current is only set once that's true.
  const { remainingSeconds } = useCountdownTimer(
    VOICE_QUESTION_SECONDS,
    currentQuestion?.order ?? 0,
    () => {
      if (mode === "voice" && interview?.status === "in_progress") {
        handleNextRef.current?.();
      }
    },
  );

  if (isLoading || !interview || !hasInitialized) {
    return <LiveInterviewSkeleton />;
  }

  if (interview.status !== "in_progress") {
    return <ResultsView interview={interview} />;
  }

  const isLast = currentIndex === interview.questions.length - 1;

  const saveCurrentAnswer = async () => {
    if (!currentQuestion || !answerDraft.trim()) return;
    await submitAnswer({
      interviewId: interview.id,
      questionOrder: currentQuestion.order,
      answerText: answerDraft.trim(),
      timeTakenSeconds: getElapsedSeconds(),
    });
  };

  const handleJump = async (index: number) => {
    await saveCurrentAnswer();
    setCurrentIndex(index);
  };

  const handlePrevious = async () => {
    await saveCurrentAnswer();
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = async () => {
    await saveCurrentAnswer();
    if (isLast) {
      setShowEndConfirm(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };
  handleNextRef.current = handleNext;

  // Explicitly skips without submitting whatever's currently drafted —
  // distinct from Next, which saves the draft first. Voice mode only.
  const handleSkip = () => {
    setAnswerDraft("");
    if (isLast) {
      setShowEndConfirm(true);
    } else {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handleConfirmEnd = async () => {
    await saveCurrentAnswer();
    await completeInterview(interview.id);
    setShowEndConfirm(false);
  };

  return (
    <div className="mx-auto flex max-w-2xl flex-col gap-6">
      <div className="flex items-center justify-between">
        <ProgressStepper
          questions={interview.questions}
          currentIndex={currentIndex}
          onJump={handleJump}
        />
      </div>

      <div className="flex items-center justify-between">
        <InterviewTimer elapsedSeconds={elapsedSeconds} />
        <Button variant="ghost" size="sm" onClick={() => setShowEndConfirm(true)}>
          <Flag className="size-4" />
          End interview
        </Button>
      </div>

      <InterviewModeToggle mode={mode} onChange={setMode} voiceSupported={voiceApiSupported} />

      {currentQuestion && <QuestionCard question={currentQuestion} />}

      {mode === "voice" && currentQuestion && (
        <>
          <VoiceQuestionPlayer
            questionText={currentQuestion.questionText}
            questionKey={currentQuestion.order}
            isSupported={speech.isSupported}
            isSpeaking={speech.isSpeaking}
            isMuted={speech.isMuted}
            onSpeak={speech.speak}
            onStop={speech.stop}
            onToggleMute={speech.toggleMute}
          />
          <div className="flex items-center justify-between">
            <CountdownTimer remainingSeconds={remainingSeconds} />
            <Button variant="ghost" size="sm" onClick={handleSkip}>
              <SkipForward className="size-4" />
              Skip question
            </Button>
          </div>
          <VoiceAnswerRecorder
            value={answerDraft}
            onChange={setAnswerDraft}
            disabled={isSubmittingAnswer}
          />
        </>
      )}

      <AnswerEditor value={answerDraft} onChange={setAnswerDraft} disabled={isSubmittingAnswer} />

      <NavigationControls
        isFirst={currentIndex === 0}
        isLast={isLast}
        isSaving={isSubmittingAnswer}
        onPrevious={handlePrevious}
        onNext={handleNext}
      />

      <Modal
        open={showEndConfirm}
        onClose={() => setShowEndConfirm(false)}
        title="End this interview?"
        description="Unanswered questions will be left blank. This can't be undone."
      >
        <div className="flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setShowEndConfirm(false)}>
            Keep going
          </Button>
          <Button variant="destructive" onClick={handleConfirmEnd} isLoading={isCompleting}>
            End interview
          </Button>
        </div>
      </Modal>
    </div>
  );
}
