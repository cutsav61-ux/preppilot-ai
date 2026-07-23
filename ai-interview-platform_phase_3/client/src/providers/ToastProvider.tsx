"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      toastOptions={{
        classNames: {
          toast: "!rounded-lg !border !border-border !bg-surface !font-body !text-ink !shadow-card",
          title: "font-medium",
          description: "!text-ink-soft",
        },
      }}
    />
  );
}
