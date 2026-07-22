import { ArrowLeft, ArrowRight, Flag } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function NavigationControls({
  isFirst,
  isLast,
  isSaving,
  onPrevious,
  onNext,
}: {
  isFirst: boolean;
  isLast: boolean;
  isSaving: boolean;
  onPrevious: () => void;
  onNext: () => void;
}) {
  return (
    <div className="flex items-center justify-between">
      <Button variant="outline" onClick={onPrevious} disabled={isFirst || isSaving}>
        <ArrowLeft className="size-4" />
        Previous
      </Button>
      <Button variant="cobalt" onClick={onNext} isLoading={isSaving}>
        {isLast ? (
          <>
            <Flag className="size-4" />
            Finish
          </>
        ) : (
          <>
            Next
            <ArrowRight className="size-4" />
          </>
        )}
      </Button>
    </div>
  );
}
