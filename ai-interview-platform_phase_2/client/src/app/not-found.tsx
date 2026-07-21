import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/lib/constants";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-grid-paper px-6 text-center">
      <p className="font-mono text-xs uppercase tracking-wider text-ink-soft">Error 404</p>
      <h1 className="font-display text-3xl font-medium text-ink">This page didn't generate.</h1>
      <p className="max-w-sm text-sm text-ink-soft">
        The route you're looking for doesn't exist, or it moved. Head back and try again.
      </p>
      <Link href={ROUTES.home}>
        <Button variant="cobalt" className="mt-2">
          Back to home
        </Button>
      </Link>
    </div>
  );
}
