/**
 * Strips angle-bracket tags from free-text input before storage. React
 * already escapes output on render (no `dangerouslySetInnerHTML` is used
 * anywhere in this codebase), so this isn't the primary XSS defense — it's
 * a defense-in-depth layer so stored data itself never contains raw markup
 * (useful for the PDF export and any future non-React consumer of this data).
 */
export function sanitizeText(input: string): string {
  return input.replace(/<[^>]*>/g, "").trim();
}
