import type { Request, Response } from "express";
import { userService } from "../services/user.service";
import { asyncHandler } from "../utils/asyncHandler";
import { sendSuccess } from "../utils/apiResponse";

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
};
