import { User } from "../models/User.model";
import { RefreshToken } from "../models/RefreshToken.model";
import { Interview } from "../models/Interview.model";
import { hashPassword, comparePassword } from "../utils/bcrypt";
import { AppError } from "../middlewares/error.middleware";
import type { UpdateProfileInput, UpdateSettingsInput } from "../validators/user.validator";

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

  async updateSettings(userId: string, input: UpdateSettingsInput) {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("Account no longer exists.", 404, "ACCOUNT_NOT_FOUND");
    }

    if (input.theme !== undefined) user.settings.theme = input.theme;
    if (input.emailNotifications !== undefined) {
      user.settings.emailNotifications = input.emailNotifications;
    }
    if (input.defaultInterviewType !== undefined) {
      user.settings.defaultInterviewType = input.defaultInterviewType;
    }
    if (input.defaultDifficulty !== undefined) {
      user.settings.defaultDifficulty = input.defaultDifficulty;
    }

    await user.save();
    return user;
  },

  async deleteAccount(userId: string, password: string) {
    const user = await User.findById(userId).select("+password");
    if (!user) {
      throw new AppError("Account no longer exists.", 404, "ACCOUNT_NOT_FOUND");
    }

    const isValid = await comparePassword(password, user.password);
    if (!isValid) {
      throw new AppError("Incorrect password.", 401, "INVALID_CREDENTIALS");
    }

    // Cascade delete everything tied to this account.
    await Promise.all([
      Interview.deleteMany({ userId }),
      RefreshToken.deleteMany({ userId }),
      User.findByIdAndDelete(userId),
    ]);
  },

  async exportUserData(userId: string) {
    const [user, interviews] = await Promise.all([
      User.findById(userId),
      Interview.find({ userId }).sort({ createdAt: -1 }),
    ]);

    if (!user) {
      throw new AppError("Account no longer exists.", 404, "ACCOUNT_NOT_FOUND");
    }

    return {
      exportedAt: new Date().toISOString(),
      profile: user.toJSON(),
      interviews: interviews.map((interview) => interview.toJSON()),
    };
  },

  async listSessions(userId: string) {
    const sessions = await RefreshToken.find({ userId }).sort({ createdAt: -1 });
    return sessions.map((session) => ({
      id: session._id.toString(),
      deviceInfo: session.deviceInfo ?? "Unknown device",
      createdAt: session.createdAt,
      expiresAt: session.expiresAt,
    }));
  },

  async revokeSession(userId: string, sessionId: string) {
    const result = await RefreshToken.deleteOne({ _id: sessionId, userId });
    if (result.deletedCount === 0) {
      throw new AppError("Session not found.", 404, "SESSION_NOT_FOUND");
    }
  },

  async revokeAllSessions(userId: string) {
    await RefreshToken.deleteMany({ userId });
  },
};
