import type { Request, Response } from "express";
import { interviewService } from "../services/interview.service";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";
import type { ListInterviewsQuery } from "../validators/interview.validator";

export const interviewController = {
  create: asyncHandler(async (req: Request, res: Response) => {
    const interview = await interviewService.createInterview(req.user!.id, req.body);
    return sendSuccess(res, { interview }, "Interview created.", 201);
  }),

  list: asyncHandler(async (req: Request, res: Response) => {
    const query = req.query as unknown as ListInterviewsQuery;
    const { interviews, meta } = await interviewService.listInterviews(req.user!.id, query);
    return sendSuccess(res, { interviews }, undefined, 200, meta);
  }),

  getById: asyncHandler(async (req: Request, res: Response) => {
    const interview = await interviewService.getInterviewById(req.user!.id, req.params.id as string);
    return sendSuccess(res, { interview });
  }),

  submitAnswer: asyncHandler(async (req: Request, res: Response) => {
    const interview = await interviewService.submitAnswer(req.user!.id, req.params.id as string, req.body);
    return sendSuccess(res, { interview }, "Answer saved.");
  }),

  complete: asyncHandler(async (req: Request, res: Response) => {
    const interview = await interviewService.completeInterview(req.user!.id, req.params.id as string);
    return sendSuccess(res, { interview }, "Interview completed.");
  }),

  abandon: asyncHandler(async (req: Request, res: Response) => {
    const interview = await interviewService.abandonInterview(req.user!.id, req.params.id as string);
    return sendSuccess(res, { interview }, "Interview abandoned.");
  }),
};
