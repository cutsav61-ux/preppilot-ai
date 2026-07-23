import { Router } from "express";
import { reportController } from "../controllers/report.controller";
import { requireAuth } from "../middlewares/auth.middleware";

const router = Router();

router.use(requireAuth);

router.get("/:id", reportController.download);

export default router;
