import type { Request, Response } from "express";
import { authService } from "../services/auth.service";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";
import { setRefreshTokenCookie, clearRefreshTokenCookie } from "../utils/cookies";
import { REFRESH_TOKEN_COOKIE_NAME } from "../config/constants";
import { AppError } from "../middlewares/error.middleware";

function getRefreshTokenFromRequest(req: Request): string | undefined {
  return req.signedCookies?.[REFRESH_TOKEN_COOKIE_NAME];
}

export const authController = {
  signup: asyncHandler(async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await authService.register(
      req.body,
      req.headers["user-agent"],
    );
    setRefreshTokenCookie(res, refreshToken);
    return sendSuccess(res, { user, accessToken }, "Account created.", 201);
  }),

  login: asyncHandler(async (req: Request, res: Response) => {
    const { user, accessToken, refreshToken } = await authService.login(
      req.body,
      req.headers["user-agent"],
    );
    setRefreshTokenCookie(res, refreshToken);
    return sendSuccess(res, { user, accessToken }, "Logged in.");
  }),

  refresh: asyncHandler(async (req: Request, res: Response) => {
    const rawRefreshToken = getRefreshTokenFromRequest(req);
    if (!rawRefreshToken) {
      throw new AppError("No active session found.", 401, "NO_REFRESH_TOKEN");
    }

    const { user, accessToken, refreshToken } = await authService.refresh(
      rawRefreshToken,
      req.headers["user-agent"],
    );
    setRefreshTokenCookie(res, refreshToken);
    return sendSuccess(res, { user, accessToken }, "Session refreshed.");
  }),

  logout: asyncHandler(async (req: Request, res: Response) => {
    const rawRefreshToken = getRefreshTokenFromRequest(req);
    await authService.logout(rawRefreshToken);
    clearRefreshTokenCookie(res);
    return sendSuccess(res, null, "Logged out.");
  }),

  me: asyncHandler(async (req: Request, res: Response) => {
    const user = await authService.getUserById(req.user!.id);
    return sendSuccess(res, { user });
  }),

  forgotPassword: asyncHandler(async (req: Request, res: Response) => {
    await authService.forgotPassword(req.body.email);
    return sendSuccess(
      res,
      null,
      "If an account exists for that email, a reset link is on its way.",
    );
  }),

  resetPassword: asyncHandler(async (req: Request, res: Response) => {
    await authService.resetPassword(req.body.token, req.body.password);
    return sendSuccess(res, null, "Password updated. You can now log in with your new password.");
  }),
};
