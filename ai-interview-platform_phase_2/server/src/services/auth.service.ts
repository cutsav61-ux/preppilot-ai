import crypto from "crypto";
import { User, type UserDocument } from "../models/User.model";
import { RefreshToken } from "../models/RefreshToken.model";
import { hashPassword, comparePassword } from "../utils/bcrypt";
import { signAccessToken, signRefreshToken, verifyRefreshToken } from "../utils/jwt";
import { AppError } from "../middlewares/error.middleware";
import { sendEmail, buildPasswordResetEmail } from "../utils/mailer";
import { env } from "../config/env";
import { PASSWORD_RESET_TOKEN_EXPIRY_MINUTES } from "../config/constants";
import ms from "ms";

function hashToken(token: string): string {
  return crypto.createHash("sha256").update(token).digest("hex");
}

function refreshExpiryDate(): Date {
  const durationMs = ms(env.JWT_REFRESH_EXPIRY as Parameters<typeof ms>[0]);
  return new Date(Date.now() + (typeof durationMs === "number" ? durationMs : 30 * 24 * 60 * 60 * 1000));
}

async function issueTokenPair(userId: string, deviceInfo?: string) {
  const accessToken = signAccessToken({ sub: userId });
  const refreshToken = signRefreshToken({ sub: userId });

  await RefreshToken.create({
    userId,
    tokenHash: hashToken(refreshToken),
    deviceInfo,
    expiresAt: refreshExpiryDate(),
  });

  return { accessToken, refreshToken };
}

export const authService = {
  async register(input: { name: string; email: string; password: string }, deviceInfo?: string) {
    const existing = await User.findOne({ email: input.email });
    if (existing) {
      throw new AppError("An account with this email already exists.", 409, "EMAIL_TAKEN");
    }

    const passwordHash = await hashPassword(input.password);
    const user = await User.create({
      name: input.name,
      email: input.email,
      password: passwordHash,
    });

    const tokens = await issueTokenPair(user._id.toString(), deviceInfo);
    return { user, ...tokens };
  },

  async login(input: { email: string; password: string }, deviceInfo?: string) {
    const user = await User.findOne({ email: input.email }).select("+password");
    if (!user) {
      throw new AppError("Invalid email or password.", 401, "INVALID_CREDENTIALS");
    }

    const isValid = await comparePassword(input.password, user.password);
    if (!isValid) {
      throw new AppError("Invalid email or password.", 401, "INVALID_CREDENTIALS");
    }

    const tokens = await issueTokenPair(user._id.toString(), deviceInfo);
    return { user, ...tokens };
  },

  async refresh(rawRefreshToken: string, deviceInfo?: string) {
    let payload;
    try {
      payload = verifyRefreshToken(rawRefreshToken);
    } catch {
      throw new AppError("Session expired. Please log in again.", 401, "INVALID_REFRESH_TOKEN");
    }

    const tokenHash = hashToken(rawRefreshToken);
    const storedToken = await RefreshToken.findOne({ tokenHash, userId: payload.sub });

    if (!storedToken || storedToken.expiresAt.getTime() < Date.now()) {
      throw new AppError("Session expired. Please log in again.", 401, "INVALID_REFRESH_TOKEN");
    }

    const user = await User.findById(payload.sub);
    if (!user) {
      throw new AppError("Account no longer exists.", 401, "ACCOUNT_NOT_FOUND");
    }

    // Rotate: invalidate the used refresh token, issue a brand new pair.
    await storedToken.deleteOne();
    const tokens = await issueTokenPair(user._id.toString(), deviceInfo);

    return { user, ...tokens };
  },

  async logout(rawRefreshToken: string | undefined) {
    if (!rawRefreshToken) return;
    const tokenHash = hashToken(rawRefreshToken);
    await RefreshToken.deleteOne({ tokenHash });
  },

  async forgotPassword(email: string) {
    const user = await User.findOne({ email });

    // Always behave the same way whether or not the account exists, so we
    // don't leak which emails are registered.
    if (!user) return;

    const rawToken = crypto.randomBytes(32).toString("hex");
    user.passwordResetTokenHash = hashToken(rawToken);
    user.passwordResetExpires = new Date(Date.now() + PASSWORD_RESET_TOKEN_EXPIRY_MINUTES * 60 * 1000);
    await user.save();

    const resetUrl = `${env.CLIENT_URL}/reset-password?token=${rawToken}`;
    const email_ = buildPasswordResetEmail(resetUrl);
    await sendEmail({ to: user.email, ...email_ });
  },

  async resetPassword(rawToken: string, newPassword: string) {
    const tokenHash = hashToken(rawToken);
    const user = await User.findOne({
      passwordResetTokenHash: tokenHash,
      passwordResetExpires: { $gt: new Date() },
    }).select("+passwordResetTokenHash +passwordResetExpires");

    if (!user) {
      throw new AppError("This reset link is invalid or has expired.", 400, "INVALID_RESET_TOKEN");
    }

    user.password = await hashPassword(newPassword);
    user.passwordResetTokenHash = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // Invalidate every existing session — force re-login everywhere.
    await RefreshToken.deleteMany({ userId: user._id });
  },

  async getUserById(userId: string): Promise<UserDocument> {
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError("Account no longer exists.", 401, "ACCOUNT_NOT_FOUND");
    }
    return user;
  },
};
