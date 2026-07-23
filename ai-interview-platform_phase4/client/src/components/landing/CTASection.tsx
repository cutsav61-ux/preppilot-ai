"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/lib/constants";

export function CTASection() {
  return (
    <section className="border-t border-border py-24">
      <div className="container-shell">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative overflow-hidden rounded-xl border border-border bg-ink px-8 py-16 text-center md:px-16"
        >
          <div
            className="absolute inset-0 bg-grid-paper opacity-[0.06]"
            style={{ filter: "invert(1)" }}
            aria-hidden
          />
          <h2 className="relative font-display text-3xl font-medium tracking-tight text-paper md:text-4xl">
            Your next interview starts here.
          </h2>
          <p className="relative mx-auto mt-4 max-w-md text-sm text-paper/70">
            Free to start. No recruiter watching, no pressure — just a graded run-through before
            it counts.
          </p>
          <Link href={ROUTES.signup} className="relative mt-8 inline-block">
            <Button variant="cobalt" size="lg" className="group">
              Start a mock interview
              <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
