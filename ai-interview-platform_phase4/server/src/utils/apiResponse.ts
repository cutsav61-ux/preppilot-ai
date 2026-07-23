import type { Response } from "express";

interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export function sendSuccess<T>(
  res: Response,
  data: T,
  message?: string,
  status = 200,
  meta?: PaginationMeta,
) {
  return res.status(status).json({
    success: true,
    data,
    message,
    ...(meta ? { meta } : {}),
  });
}

export function sendError(
  res: Response,
  message: string,
  status = 400,
  code?: string,
  details?: unknown,
) {
  return res.status(status).json({
    success: false,
    message,
    error: { code: code ?? "ERROR", details },
  });
}
