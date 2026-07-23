import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { logger } from "../utils/logger";
import { isProduction } from "../config/env";

export class AppError extends Error {
  constructor(
    message: string,
    public status = 400,
    public code = "ERROR",
    public details?: unknown,
  ) {
    super(message);
    this.name = "AppError";
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: unknown, req: Request, res: Response, _next: NextFunction) {
  if (err instanceof ZodError) {
    return res.status(422).json({
      success: false,
      message: "Validation failed.",
      error: { code: "VALIDATION_ERROR", details: err.flatten() },
    });
  }

  if (err instanceof AppError) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
      error: { code: err.code, details: err.details },
    });
  }

  logger.error({ err }, "Unhandled error");

  return res.status(500).json({
    success: false,
    message: "Something went wrong on our end. Please try again.",
    error: {
      code: "INTERNAL_ERROR",
      details: isProduction ? undefined : (err as Error)?.message,
    },
  });
}
