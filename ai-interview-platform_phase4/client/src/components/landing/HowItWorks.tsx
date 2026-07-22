"use client";

import { motion } from "framer-motion";

const STEPS = [
  {
    number: "01",
    title: "Choose your interview",
    description: "Pick technical or HR, then set the topic and difficulty.",
  },
  {
    number: "02",
    title: "Answer under a timer",
    description: "Respond like you would in the real thing — no do-overs mid-question.",
  },
  {
    number: "03",
    title: "Get graded instantly",
    description: "The AI scores each answer and flags strengths and gaps as you go.",
  },
  {
    number: "04",
    title: "Review and improve",
    description: "Study the full transcript, track score trends, and drill your weak spots.",
  },
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-border py-24">
      <div className="container-shell">
        <div className="max-w-xl">
          <p className="font-mono text-xs uppercase tracking-wider text-cobalt">The loop</p>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink md:text-4xl">
            How a session actually runs.
          </h2>
        </div>

        <div className="mt-14 grid gap-10 md:grid-cols-4">
          {STEPS.map((step, index) => (
            <motion.div
              key={step.number}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              className="relative"
            >
              <span className="font-display text-4xl font-semibold text-ink/10">
                {step.number}
              </span>
              <h3 className="mt-3 font-display text-base font-medium text-ink">{step.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-soft">{step.description}</p>
              {index < STEPS.length - 1 && (
                <span className="absolute right-[-1.25rem] top-2 hidden h-px w-8 bg-border md:block" />
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
