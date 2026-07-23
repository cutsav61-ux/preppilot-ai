"use client";

import { cn } from "@/lib/utils";

export interface HistoryFilterState {
  type?: "technical" | "hr";
  difficulty?: "easy" | "medium" | "hard";
  status?: "in_progress" | "completed" | "abandoned";
}

const TYPE_OPTIONS = [
  { value: undefined, label: "All types" },
  { value: "technical" as const, label: "Technical" },
  { value: "hr" as const, label: "HR" },
];

const DIFFICULTY_OPTIONS = [
  { value: undefined, label: "All difficulties" },
  { value: "easy" as const, label: "Easy" },
  { value: "medium" as const, label: "Medium" },
  { value: "hard" as const, label: "Hard" },
];

const STATUS_OPTIONS = [
  { value: undefined, label: "All statuses" },
  { value: "completed" as const, label: "Completed" },
  { value: "in_progress" as const, label: "In progress" },
  { value: "abandoned" as const, label: "Abandoned" },
];

function FilterGroup<T extends string | undefined>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
}) {
  return (
    <div className="flex flex-wrap gap-1.5">
      {options.map((option) => {
        const isActive = option.value === value;
        return (
          <button
            key={option.label}
            type="button"
            onClick={() => onChange(option.value)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              isActive
                ? "border-cobalt bg-cobalt-soft text-cobalt"
                : "border-border bg-surface text-ink-soft hover:border-cobalt/40 hover:text-ink",
            )}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}

export function HistoryFilters({
  filters,
  onChange,
}: {
  filters: HistoryFilterState;
  onChange: (filters: HistoryFilterState) => void;
}) {
  return (
    <div className="flex flex-col gap-3">
      <FilterGroup
        options={TYPE_OPTIONS}
        value={filters.type}
        onChange={(type) => onChange({ ...filters, type })}
      />
      <FilterGroup
        options={DIFFICULTY_OPTIONS}
        value={filters.difficulty}
        onChange={(difficulty) => onChange({ ...filters, difficulty })}
      />
      <FilterGroup
        options={STATUS_OPTIONS}
        value={filters.status}
        onChange={(status) => onChange({ ...filters, status })}
      />
    </div>
  );
}
