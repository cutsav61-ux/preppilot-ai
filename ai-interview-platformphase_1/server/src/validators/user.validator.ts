import { z } from "zod";
import { EXPERIENCE_LEVELS } from "../config/constants";

export const updateProfileSchema = z.object({
  name: z.string().trim().min(2).max(80).optional(),
  bio: z.string().trim().max(500).optional(),
  targetRole: z.string().trim().max(80).optional(),
  experienceLevel: z.enum(EXPERIENCE_LEVELS).optional(),
  avatarUrl: z.string().trim().url("Avatar must be a valid URL").optional().or(z.literal("")),
});
export type UpdateProfileInput = z.infer<typeof updateProfileSchema>;

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72, "Password must be under 72 characters")
    .regex(/[a-zA-Z]/, "Password must contain at least one letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});
export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
