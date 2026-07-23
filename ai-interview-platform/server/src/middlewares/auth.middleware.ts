import type { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/jwt";
import { sendError } from "../utils/apiResponse";

/**
 * Verifies the `Authorization: Bearer <token>` access token and attaches
 * `req.user`. Full session logic (issuing tokens on login, rotating them
 * on refresh) is implemented in Phase 1 alongside the User model.
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header?.startsWith("Bearer ")) {
    return sendError(res, "Authentication required.", 401, "UNAUTHENTICATED");
  }

  const token = header.slice("Bearer ".length);

  try {
    const payload = verifyAccessToken(token);
    req.user = { id: payload.sub };
    return next();
  } catch {
    return sendError(res, "Session expired or invalid. Please log in again.", 401, "INVALID_TOKEN");
  }
}
