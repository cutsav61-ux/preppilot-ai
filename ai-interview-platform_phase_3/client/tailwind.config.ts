import type { Config } from "tailwindcss";

/**
 * Design tokens for the AI Interview Platform.
 *
 * Concept: a "lab notebook / graded transcript" aesthetic — a soft graph-paper
 * surface, ink-navy text, and a cobalt/amber/coral accent trio that reads like
 * a grading pen marking up a technical interview transcript. See
 * src/app/globals.css for the CSS custom properties these map to (and the
 * dark-mode overrides).
 */
const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{ts,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        paper: "hsl(var(--paper) / <alpha-value>)",
        surface: "hsl(var(--surface) / <alpha-value>)",
        "grid-line": "hsl(var(--grid-line) / <alpha-value>)",
        ink: "hsl(var(--ink) / <alpha-value>)",
        "ink-soft": "hsl(var(--ink-soft) / <alpha-value>)",
        cobalt: {
          DEFAULT: "hsl(var(--cobalt) / <alpha-value>)",
          soft: "hsl(var(--cobalt-soft) / <alpha-value>)",
        },
        amber: {
          DEFAULT: "hsl(var(--amber) / <alpha-value>)",
          soft: "hsl(var(--amber-soft) / <alpha-value>)",
        },
        coral: {
          DEFAULT: "hsl(var(--coral) / <alpha-value>)",
          soft: "hsl(var(--coral-soft) / <alpha-value>)",
        },
        border: "hsl(var(--border) / <alpha-value>)",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      borderRadius: {
        sm: "6px",
        md: "10px",
        lg: "16px",
        xl: "22px",
      },
      backgroundImage: {
        "grid-paper":
          "linear-gradient(hsl(var(--grid-line) / 0.55) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--grid-line) / 0.55) 1px, transparent 1px)",
      },
      backgroundSize: {
        "grid-paper": "28px 28px",
      },
      boxShadow: {
        card: "0 1px 2px hsl(var(--ink) / 0.04), 0 8px 24px -12px hsl(var(--ink) / 0.12)",
        "card-hover": "0 2px 4px hsl(var(--ink) / 0.06), 0 16px 40px -14px hsl(var(--ink) / 0.18)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scanline: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.6s ease-out both",
        scanline: "scanline 2.4s linear infinite",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};

export default config;
