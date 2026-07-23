import { Router } from "express";
import { analyticsController } from "../controllers/analytics.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { scoreTrendQuerySchema } from "../validators/analytics.validator";

const router = Router();

router.use(requireAuth);

router.get("/overview", analyticsController.overview);
router.get("/score-trend", validate(scoreTrendQuerySchema, "query"), analyticsController.scoreTrend);
router.get("/category-breakdown", analyticsController.categoryBreakdown);

export default router;
