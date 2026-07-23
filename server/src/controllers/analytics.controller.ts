import type { Request, Response } from "express";
import { analyticsService } from "../services/analytics.service";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";
import type { ScoreTrendQuery } from "../validators/analytics.validator";

export const analyticsController = {
  overview: asyncHandler(async (req: Request, res: Response) => {
    const overview = await analyticsService.getOverview(req.user!.id);
    return sendSuccess(res, overview);
  }),

  summary: asyncHandler(async (req: Request, res: Response) => {
    const summary = await analyticsService.getSummary(req.user!.id);
    return sendSuccess(res, summary);
  }),

  scoreTrend: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as ScoreTrendQuery;
    const trend = await analyticsService.getScoreTrend(req.user!.id, query);
    return sendSuccess(res, { trend });
  }),

  categoryBreakdown: asyncHandler(async (req: Request, res: Response) => {
    const breakdown = await analyticsService.getCategoryBreakdown(req.user!.id);
    return sendSuccess(res, { breakdown });
  }),
};
