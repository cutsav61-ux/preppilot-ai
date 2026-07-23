import { Router } from "express";
import { interviewController } from "../controllers/interview.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import { listInterviewsQuerySchema } from "../validators/interview.validator";

/**
 * GET /history and GET /history/:id are aliases over the same interview
 * data as GET /interviews and GET /interviews/:id (Phase 3/4). They exist
 * as a separate path because Phase 5 asked for it explicitly, but they
 * delegate to the same controller — no logic is duplicated, and nothing
 * about /interviews changes.
 */
const router = Router();

router.use(requireAuth);

router.get("/", validate(listInterviewsQuerySchema, "query"), interviewController.list);
router.get("/:id", interviewController.getById);

export default router;
