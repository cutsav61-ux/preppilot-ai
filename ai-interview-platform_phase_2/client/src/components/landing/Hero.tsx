"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, CheckCircle2, AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/lib/constants";

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        className="absolute inset-0 -z-10 bg-grid-paper bg-grid-paper opacity-60"
        aria-hidden
      />
      <div className="container-shell grid items-center gap-14 py-20 md:py-28 lg:grid-cols-2">
        <motion.div variants={container} initial="hidden" animate="show">
          <motion.span
            variants={item}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 font-mono text-xs text-ink-soft"
          >
            AI_INTERVIEW_ENGINE
          </motion.span>

          <motion.h1
            variants={item}
            className="mt-5 font-display text-4xl font-medium leading-[1.08] tracking-tight text-ink md:text-5xl lg:text-[3.4rem]"
          >
            Practice interviews that
            <br />
            actually push back.
          </motion.h1>

          <motion.p variants={item} className="mt-5 max-w-lg text-lg text-ink-soft">
            Generate realistic technical and HR interviews, answer them under a timer, and get
            graded like a real interviewer would — strengths, gaps, and exactly what to fix
            before the real thing.
          </motion.p>

          <motion.div variants={item} className="mt-8 flex flex-wrap items-center gap-3">
            <Link href={ROUTES.signup}>
              <Button variant="cobalt" size="lg" className="group">
                Start a mock interview
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Button>
            </Link>
            <a href="#how-it-works">
              <Button variant="outline" size="lg">
                See how scoring works
              </Button>
            </a>
          </motion.div>

          <motion.div
            variants={item}
            className="mt-8 flex flex-wrap items-center gap-2 font-mono text-xs text-ink-soft"
          >
            <span className="rounded border border-border px-2 py-1">TECHNICAL</span>
            <span className="rounded border border-border px-2 py-1">HR</span>
            <span className="rounded border border-border px-2 py-1">EASY → HARD</span>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 24, rotate: -1 }}
          animate={{ opacity: 1, y: 0, rotate: -1 }}
          transition={{ duration: 0.7, ease: "easeOut", delay: 0.2 }}
          className="relative"
        >
          <div className="relative mx-auto max-w-md rotate-[1deg] rounded-lg border border-border bg-surface shadow-card-hover">
            <div className="flex items-center justify-between border-b border-border px-5 py-3">
              <span className="font-mono text-xs text-ink-soft">session_04.transcript</span>
              <span className="flex items-center gap-1.5 font-mono text-xs text-cobalt">
                <span className="relative flex size-1.5">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-cobalt opacity-75" />
                  <span className="relative inline-flex size-1.5 rounded-full bg-cobalt" />
                </span>
                evaluating
              </span>
            </div>

            <div className="relative overflow-hidden p-5">
              <div className="pointer-events-none absolute inset-x-0 top-0 h-16 animate-scanline bg-gradient-to-b from-cobalt/10 to-transparent" />

              <p className="font-mono text-xs uppercase tracking-wide text-ink-soft">
                Q3 · System Design
              </p>
              <p className="mt-1.5 text-sm text-ink">
                "How would you design a rate limiter for a public API?"
              </p>

              <div className="mt-4 rounded-md border border-border bg-paper p-3">
                <p className="text-xs leading-relaxed text-ink-soft">
                  "I'd use a token bucket per API key, stored in Redis with a TTL, and reject
                  requests once the bucket's empty..."
                </p>
              </div>

              <div className="mt-3 flex items-start gap-2 rounded-md bg-amber-soft px-3 py-2">
                <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-amber" />
                <p className="text-xs text-ink">Correct core mechanism — token bucket is a solid fit</p>
              </div>
              <div className="mt-2 flex items-start gap-2 rounded-md bg-coral-soft px-3 py-2">
                <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-coral" />
                <p className="text-xs text-ink">Didn't cover what happens across multiple servers</p>
              </div>

              <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
                <span className="text-xs text-ink-soft">Answer score</span>
                <span className="font-display text-lg font-semibold text-ink">78<span className="text-ink-soft text-sm">/100</span></span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
