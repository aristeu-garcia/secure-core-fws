import { Router } from "express";
import authController from "../controllers/authController.js";
import { withRefreshAuth } from "../middlewares/authMiddleware.js";

const router = Router();

router.post("/login", authController.login);

router.post("/refresh", withRefreshAuth, authController.refreshToken);

export default router;
