import type { ReactNode } from "react";
import Link from "next/link";
import { TerminalSquare, CheckCircle2, AlertTriangle } from "lucide-react";
import { ROUTES } from "@/lib/constants";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col justify-between p-8 md:p-12">
        <Link href={ROUTES.home} className="flex items-center gap-2">
          <span className="flex size-8 items-center justify-center rounded-md bg-ink text-paper">
            <TerminalSquare className="size-4" />
          </span>
          <span className="font-display text-[15px] font-semibold tracking-tight text-ink">
            interview<span className="text-cobalt">.engine</span>
          </span>
        </Link>

        <div className="flex flex-1 items-center justify-center py-12">{children}</div>

        <p className="text-center text-xs text-ink-soft lg:text-left">
          © {new Date().getFullYear()} AI Interview Platform
        </p>
      </div>

      <div className="relative hidden overflow-hidden border-l border-border bg-ink lg:block">
        <div className="absolute inset-0 bg-grid-paper opacity-[0.06]" style={{ filter: "invert(1)" }} aria-hidden />
        <div className="relative flex h-full flex-col items-center justify-center px-16">
          <div className="w-full max-w-sm rotate-[-1deg] rounded-lg border border-white/10 bg-white/[0.04] p-5 backdrop-blur-sm">
            <p className="font-mono text-xs uppercase tracking-wide text-paper/50">
              Q2 · Behavioral
            </p>
            <p className="mt-1.5 text-sm text-paper">
              "Tell me about a time you disagreed with a teammate."
            </p>
            <div className="mt-4 flex items-start gap-2 rounded-md bg-white/[0.06] px-3 py-2">
              <CheckCircle2 className="mt-0.5 size-3.5 shrink-0 text-amber" />
              <p className="text-xs text-paper/80">Clear structure — situation, action, outcome</p>
            </div>
            <div className="mt-2 flex items-start gap-2 rounded-md bg-white/[0.06] px-3 py-2">
              <AlertTriangle className="mt-0.5 size-3.5 shrink-0 text-coral" />
              <p className="text-xs text-paper/80">No mention of what you'd do differently</p>
            </div>
          </div>
          <p className="mt-8 max-w-xs text-center text-sm text-paper/60">
            Every answer gets graded the moment you submit it — not after the interview ends.
          </p>
        </div>
      </div>
    </div>
  );
}
