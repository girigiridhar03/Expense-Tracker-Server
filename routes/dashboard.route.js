import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  budgetMetric,
  budgetOverview,
  pieCategories,
} from "../controller/dashboard.controller.js";

const dashboardRouter = express.Router();

dashboardRouter.get("/metrics", authMiddleware, budgetMetric);
dashboardRouter.get("/budget-overview", authMiddleware, budgetOverview);
dashboardRouter.get("/categories", authMiddleware, pieCategories);

export default dashboardRouter;
