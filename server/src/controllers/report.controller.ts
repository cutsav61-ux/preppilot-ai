import type { Request, Response } from "express";
import { interviewService } from "../services/interview.service";
import { generateInterviewReportPdf } from "../services/report.service";
import { authService } from "../services/auth.service";
import { asyncHandler } from "../utils/asyncHandler";
import { AppError } from "../middlewares/error.middleware";

export const reportController = {
  download: asyncHandler(async (req: Request, res: Response) => {
    const interview = await interviewService.getInterviewById(req.user!.id, req.params.id as string);

    if (interview.status === "in_progress") {
      throw new AppError(
        "This interview hasn't finished yet — there's no report to generate.",
        409,
        "INTERVIEW_NOT_ACTIVE",
      );
    }

    const user = await authService.getUserById(req.user!.id);
    const pdfBuffer = await generateInterviewReportPdf(interview, user.name);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="interview-report-${interview.id}.pdf"`,
    );
    res.send(pdfBuffer);
  }),
};
