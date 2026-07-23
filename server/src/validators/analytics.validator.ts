import { z } from "zod";

export const scoreTrendQuerySchema = z.object({
  range: z.enum(["30d", "90d", "all"]).default("30d"),
});
export type ScoreTrendQuery = z.infer<typeof scoreTrendQuerySchema>;
