"use client";

import { useTheme as useNextTheme } from "next-themes";
import { useEffect, useState } from "react";

/**
 * Wraps next-themes with a `mounted` flag so components can avoid
 * hydration mismatches when rendering theme-dependent UI (e.g. the
 * sun/moon icon in ThemeToggle).
 */
export function useTheme() {
  const { theme, resolvedTheme, setTheme } = useNextTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  return {
    theme,
    resolvedTheme,
    setTheme,
    mounted,
    toggleTheme: () => setTheme(resolvedTheme === "dark" ? "light" : "dark"),
  };
}
