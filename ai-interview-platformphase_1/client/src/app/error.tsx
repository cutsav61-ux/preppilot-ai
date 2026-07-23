"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/Button";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // eslint-disable-next-line no-console
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-grid-paper px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-wider text-coral">Something broke</p>
      <h1 className="font-display text-3xl font-medium text-ink">
        The session hit an unexpected error.
      </h1>
      <p className="max-w-sm text-sm text-ink-soft">
        Nothing you did caused this. Try again, and if it keeps happening, let us know what you
        were doing.
      </p>
      <Button variant="cobalt" className="mt-2" onClick={reset}>
        Try again
      </Button>
    </div>
  );
}
