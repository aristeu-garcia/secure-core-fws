import { Router } from "express";
import heathCheckRoutes from "./healthCheckRoutes.js";
import authRoutes from "./authRoutes.js";

const router = Router();
router.use(heathCheckRoutes);
router.use(authRoutes);
export default router;
