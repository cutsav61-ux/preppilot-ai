import type { ReactNode } from "react";

export function AuthCard({
  title,
  description,
  children,
  footer,
}: {
  title: string;
  description: string;
  children: ReactNode;
  footer?: ReactNode;
}) {
  return (
    <div className="w-full max-w-sm">
      <h1 className="font-display text-2xl font-medium tracking-tight text-ink">{title}</h1>
      <p className="mt-1.5 text-sm text-ink-soft">{description}</p>
      <div className="mt-8 flex flex-col gap-4">{children}</div>
      {footer && <div className="mt-6 text-sm text-ink-soft">{footer}</div>}
    </div>
  );
}
