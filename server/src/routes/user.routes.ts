import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  updateProfileSchema,
  changePasswordSchema,
  updateSettingsSchema,
  deleteAccountSchema,
} from "../validators/user.validator";

const router = Router();

router.use(requireAuth);

router.get("/profile", userController.getProfile);
router.put("/profile", validate(updateProfileSchema), userController.updateProfile);
router.put("/password", validate(changePasswordSchema), userController.changePassword);
router.put("/settings", validate(updateSettingsSchema), userController.updateSettings);
router.delete("/account", validate(deleteAccountSchema), userController.deleteAccount);
router.get("/export-data", userController.exportData);
router.get("/sessions", userController.listSessions);
router.delete("/sessions/all", userController.revokeAllSessions);
router.delete("/sessions/:id", userController.revokeSession);

export default router;
