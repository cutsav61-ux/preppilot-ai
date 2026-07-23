"use client";

import { useState } from "react";
import { Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/Button";
import { useAuthStore } from "@/store/authStore";
import { API_BASE_URL } from "@/lib/constants";

export function ExportReportButton({ interviewId }: { interviewId: string }) {
  const [isDownloading, setIsDownloading] = useState(false);
  const accessToken = useAuthStore((state) => state.accessToken);

  const handleDownload = async () => {
    setIsDownloading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/reports/${interviewId}`, {
        credentials: "include",
        headers: accessToken ? { Authorization: `Bearer ${accessToken}` } : undefined,
      });

      if (!response.ok) {
        throw new Error("Couldn't generate the report. Please try again.");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `interview-report-${interviewId}.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch {
      toast.error("Couldn't download the report. Please try again.");
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <Button variant="outline" onClick={handleDownload} isLoading={isDownloading}>
      <Download className="size-4" />
      Download PDF report
    </Button>
  );
}
