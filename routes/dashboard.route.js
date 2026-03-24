import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { budgetMetric } from "../controller/dashboard.controller.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/metrics", authMiddleware, budgetMetric);

export default dashboardRouter;
