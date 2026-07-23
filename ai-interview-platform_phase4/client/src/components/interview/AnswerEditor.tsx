"use client";

import { cn } from "@/lib/utils";

const MAX_LENGTH = 5000;

export function AnswerEditor({
  value,
  onChange,
  disabled,
}: {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor="answer" className="text-sm font-medium text-ink">
        Your answer
      </label>
      <textarea
        id="answer"
        rows={8}
        maxLength={MAX_LENGTH}
        disabled={disabled}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Answer like you would out loud — structure matters as much as content."
        className={cn(
          "w-full resize-none rounded-md border border-border bg-surface px-3.5 py-2.5 text-sm text-ink placeholder:text-ink-soft/60",
          "transition-colors focus:border-cobalt focus:outline-none focus:ring-2 focus:ring-cobalt/20",
          "disabled:opacity-60",
        )}
      />
      <p className="self-end text-xs text-ink-soft">
        {value.length}/{MAX_LENGTH}
      </p>
    </div>
  );
}
