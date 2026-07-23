import type { Request, Response } from "express";
import { userService } from "../services/user.service";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";
import { clearRefreshTokenCookie } from "../utils/cookies";

export const userController = {
  getProfile: asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.getProfile(req.user!.id);
    return sendSuccess(res, { user });
  }),

  updateProfile: asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.updateProfile(req.user!.id, req.body);
    return sendSuccess(res, { user }, "Profile updated.");
  }),

  changePassword: asyncHandler(async (req: Request, res: Response) => {
    await userService.changePassword(req.user!.id, req.body.currentPassword, req.body.newPassword);
    return sendSuccess(res, null, "Password changed. Please log in again on your other devices.");
  }),

  updateSettings: asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.updateSettings(req.user!.id, req.body);
    return sendSuccess(res, { user }, "Settings updated.");
  }),

  deleteAccount: asyncHandler(async (req: Request, res: Response) => {
    await userService.deleteAccount(req.user!.id, req.body.password);
    clearRefreshTokenCookie(res);
    return sendSuccess(res, null, "Account deleted.");
  }),

  exportData: asyncHandler(async (req: Request, res: Response) => {
    const data = await userService.exportUserData(req.user!.id);
    res.setHeader("Content-Type", "application/json");
    res.setHeader("Content-Disposition", `attachment; filename="my-data-export.json"`);
    res.send(JSON.stringify(data, null, 2));
  }),

  listSessions: asyncHandler(async (req: Request, res: Response) => {
    const sessions = await userService.listSessions(req.user!.id);
    return sendSuccess(res, { sessions });
  }),

  revokeSession: asyncHandler(async (req: Request, res: Response) => {
    await userService.revokeSession(req.user!.id, req.params.id as string);
    return sendSuccess(res, null, "Session revoked.");
  }),

  revokeAllSessions: asyncHandler(async (req: Request, res: Response) => {
    await userService.revokeAllSessions(req.user!.id);
    return sendSuccess(res, null, "All sessions logged out. You'll need to log in again everywhere.");
  }),
};
