import { Router } from "express";
import healthCheckController from "../controllers/healthCheckController.js";
import { withAccessAuth } from "../middlewares/authMiddleware.js";
const router = Router();
router.get("/health-check", withAccessAuth, healthCheckController.get);

export default router;
