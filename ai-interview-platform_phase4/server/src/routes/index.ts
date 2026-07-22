import { Router } from "express";
import { sendSuccess } from "../utils/apiResponse";
import authRoutes from "./auth.routes";
import userRoutes from "./user.routes";
import interviewRoutes from "./interview.routes";
import analyticsRoutes from "./analytics.routes";

const router = Router();

router.get("/health", (_req, res) => {
  sendSuccess(res, { status: "ok", timestamp: new Date().toISOString() }, "Service is healthy");
});

router.use("/auth", authRoutes);
router.use("/users", userRoutes);
router.use("/interviews", interviewRoutes);
router.use("/analytics", analyticsRoutes);

export default router;
