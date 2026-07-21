import { Router } from "express";
import { userController } from "../controllers/user.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { updateProfileSchema, changePasswordSchema } from "../validators/user.validator";

const router = Router();

router.use(requireAuth);

router.get("/profile", userController.getProfile);
router.put("/profile", validate(updateProfileSchema), userController.updateProfile);
router.put("/password", validate(changePasswordSchema), userController.changePassword);

// PUT /settings and DELETE /account land in Phase 3 alongside the settings page.

export default router;
