"use client";

import { motion } from "framer-motion";
import { Cpu, ClipboardCheck, FileStack, TrendingUp } from "lucide-react";

const FEATURES = [
  {
    tag: "MODULE / QUESTION_ENGINE",
    icon: Cpu,
    title: "Fresh questions, every session",
    description:
      "Generates technical and HR questions tuned to your target role, topic, and difficulty — never the same set twice.",
  },
  {
    tag: "MODULE / ANSWER_EVAL",
    icon: ClipboardCheck,
    title: "Graded like a real interviewer",
    description:
      "Every answer is scored for correctness, clarity, and structure, with specific fixes instead of vague praise.",
  },
  {
    tag: "MODULE / TRANSCRIPT",
    icon: FileStack,
    title: "A full record you can revisit",
    description:
      "Every question, answer, and piece of feedback is saved to your history so you can study it later.",
  },
  {
    tag: "MODULE / PROGRESS",
    icon: TrendingUp,
    title: "Know exactly what to drill",
    description:
      "Score trends and category breakdowns show where you're improving and which topics still need work.",
  },
];

export function FeatureGrid() {
  return (
    <section id="features" className="border-t border-border py-24">
      <div className="container-shell">
        <div className="max-w-xl">
          <p className="font-mono text-xs uppercase tracking-wider text-cobalt">What's inside</p>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink md:text-4xl">
            Four modules, one interview loop.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {FEATURES.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.08, ease: "easeOut" }}
              className="group rounded-lg border border-border bg-surface p-6 transition-shadow hover:shadow-card-hover"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[11px] tracking-wide text-ink-soft">
                  {feature.tag}
                </span>
                <feature.icon className="size-5 text-cobalt" />
              </div>
              <h3 className="mt-4 font-display text-lg font-medium text-ink">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
