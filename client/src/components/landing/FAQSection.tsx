"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

const FAQS = [
  {
    question: "Is this free to use?",
    answer:
      "Yes, you can generate and complete interviews for free. Daily limits apply to keep the AI service sustainable for everyone.",
  },
  {
    question: "What interview types are supported?",
    answer:
      "Technical (DSA, system design, core CS) and HR/behavioral, each across easy, medium, and hard difficulty.",
  },
  {
    question: "How does the AI grade answers?",
    answer:
      "Each answer is scored on correctness, clarity, and structure, then paired with concrete strengths, weaknesses, and suggestions — not just a number.",
  },
  {
    question: "Can I revisit past interviews?",
    answer:
      "Every session is saved to your history with the full transcript and feedback, plus score trends over time.",
  },
];

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section id="faq" className="border-t border-border py-24">
      <div className="container-shell max-w-2xl">
        <p className="font-mono text-xs uppercase tracking-wider text-cobalt">Questions</p>
        <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink md:text-4xl">
          Before you start.
        </h2>

        <div className="mt-10 divide-y divide-border border-t border-border">
          {FAQS.map((faq, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={faq.question}>
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between py-5 text-left"
                  aria-expanded={isOpen}
                >
                  <span className="text-sm font-medium text-ink md:text-base">
                    {faq.question}
                  </span>
                  <Plus
                    className={cn(
                      "size-4 shrink-0 text-ink-soft transition-transform duration-200",
                      isOpen && "rotate-45 text-cobalt",
                    )}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 text-sm leading-relaxed text-ink-soft">{faq.answer}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
