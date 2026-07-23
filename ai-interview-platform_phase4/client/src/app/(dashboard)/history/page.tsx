"use client";

import { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { History as HistoryIcon, ChevronLeft, ChevronRight } from "lucide-react";
import { useInterviewHistory } from "@/hooks/useInterview";
import { HistoryFilters, type HistoryFilterState } from "@/components/history/HistoryFilters";
import { HistoryCard } from "@/components/history/HistoryCard";
import { Skeleton } from "@/components/ui/Skeleton";
import { Button } from "@/components/ui/Button";
import { ROUTES } from "@/lib/constants";

export default function HistoryPage() {
  const [filters, setFilters] = useState<HistoryFilterState>({});
  const [page, setPage] = useState(1);

  const { data, isLoading } = useInterviewHistory({ page, ...filters });
  const interviews = data?.data.interviews ?? [];
  const meta = data?.meta;

  const handleFilterChange = (next: HistoryFilterState) => {
    setFilters(next);
    setPage(1);
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-6">
      <div>
        <h1 className="font-display text-xl font-medium text-ink">Interview history</h1>
        <p className="mt-1 text-sm text-ink-soft">Reopen any past session to review its feedback.</p>
      </div>

      <HistoryFilters filters={filters} onChange={handleFilterChange} />

      {isLoading ? (
        <div className="flex flex-col gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : interviews.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-md border border-dashed border-border py-16 text-center">
          <span className="flex size-10 items-center justify-center rounded-full bg-ink/5 text-ink-soft">
            <HistoryIcon className="size-5" />
          </span>
          <p className="text-sm text-ink">No interviews match these filters.</p>
          <Link href={ROUTES.interviewNew}>
            <Button variant="cobalt" size="sm" className="mt-1">
              Start a mock interview
            </Button>
          </Link>
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.05 } } }}
          className="flex flex-col gap-3"
        >
          {interviews.map((interview) => (
            <motion.div
              key={interview.id}
              variants={{
                hidden: { opacity: 0, y: 10 },
                show: { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
              }}
            >
              <HistoryCard interview={interview} />
            </motion.div>
          ))}
        </motion.div>
      )}

      {meta && meta.totalPages > 1 && (
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            <ChevronLeft className="size-4" />
            Previous
          </Button>
          <p className="text-xs text-ink-soft">
            Page {meta.page} of {meta.totalPages}
          </p>
          <Button
            variant="outline"
            size="sm"
            disabled={page >= meta.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Next
            <ChevronRight className="size-4" />
          </Button>
        </div>
      )}
    </div>
  );
}
