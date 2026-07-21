import { User } from "../models/User.model";
import { RefreshToken } from "../models/RefreshToken.model";
import { hashPassword, comparePassword } from "../utils/bcrypt";
import { AppError } from "../middlewares/error.middleware";
import type { UpdateProfileInput } from "../validators/user.validator";

export const userService = {
  async getProfile(userId: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("Account no longer exists.", 404, "ACCOUNT_NOT_FOUND");
    }
    return user;
  },

  async updateProfile(userId: string, input: UpdateProfileInput) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("Account no longer exists.", 404, "ACCOUNT_NOT_FOUND");
    }

    if (input.name !== undefined) user.name = input.name;
    if (input.bio !== undefined) user.bio = input.bio;
    if (input.targetRole !== undefined) user.targetRole = input.targetRole;
    if (input.experienceLevel !== undefined) user.experienceLevel = input.experienceLevel;
    if (input.avatarUrl !== undefined) user.avatarUrl = input.avatarUrl || undefined;

    await user.save();
    return user;
  },

  async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await User.findById(userId).select("+password");
    if (!user) {
      throw new AppError("Account no longer exists.", 404, "ACCOUNT_NOT_FOUND");
    }

    const isValid = await comparePassword(currentPassword, user.password);
    if (!isValid) {
      throw new AppError("Current password is incorrect.", 401, "INVALID_CREDENTIALS");
    }

    user.password = await hashPassword(newPassword);
    await user.save();

    // Force re-login on every other device/session for security.
    await RefreshToken.deleteMany({ userId: user._id });
  },
};
