"use client";

import { motion } from "framer-motion";
import { Avatar } from "@/components/ui/Avatar";

const TESTIMONIALS = [
  {
    name: "Priya Nair",
    role: "Final-year CSE",
    quote:
      "I stopped freezing on system design questions after doing this every night for two weeks. The feedback tells you exactly what part of the answer was weak.",
  },
  {
    name: "Arjun Mehta",
    role: "Pre-placement, ECE",
    quote:
      "The HR mode caught how vague my 'tell me about yourself' answer was. I rewrote it three times before it actually scored well.",
  },
  {
    name: "Rahul Sridhar",
    role: "Final-year IT",
    quote:
      "Seeing my scores by category made it obvious I was avoiding DP questions entirely. Fixed that in a week of focused practice.",
  },
];

export function Testimonials() {
  return (
    <section className="border-t border-border py-24">
      <div className="container-shell">
        <div className="max-w-xl">
          <p className="font-mono text-xs uppercase tracking-wider text-cobalt">Field notes</p>
          <h2 className="mt-3 font-display text-3xl font-medium tracking-tight text-ink md:text-4xl">
            Students already drilling with it.
          </h2>
        </div>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {TESTIMONIALS.map((t, index) => (
            <motion.figure
              key={t.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
              className="flex flex-col justify-between rounded-lg border border-border bg-surface p-6"
            >
              <blockquote className="text-sm leading-relaxed text-ink">"{t.quote}"</blockquote>
              <figcaption className="mt-6 flex items-center gap-3">
                <Avatar name={t.name} size="sm" />
                <div>
                  <p className="text-sm font-medium text-ink">{t.name}</p>
                  <p className="text-xs text-ink-soft">{t.role}</p>
                </div>
              </figcaption>
            </motion.figure>
          ))}
        </div>
      </div>
    </section>
  );
}
