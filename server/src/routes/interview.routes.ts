import { Router } from "express";
import { interviewController } from "../controllers/interview.controller";
import { requireAuth } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import {
  createInterviewSchema,
  submitAnswerSchema,
  listInterviewsQuerySchema,
} from "../validators/interview.validator";

const router = Router();

router.use(requireAuth);

router.post("/", validate(createInterviewSchema), interviewController.create);
router.get("/", validate(listInterviewsQuerySchema, "query"), interviewController.list);
router.get("/:id", interviewController.getById);
router.post("/:id/answers", validate(submitAnswerSchema), interviewController.submitAnswer);
router.post("/:id/complete", interviewController.complete);
router.patch("/:id/abandon", interviewController.abandon);

// DELETE /:id lands alongside the History page in Phase 6.

export default router;
