import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createCategory,
  getCategoriesWithBudget,
  getCategory,
} from "../controller/category.controller.js";

const categoryRouter = express.Router();

categoryRouter.post("/", authMiddleware, createCategory);
categoryRouter.get("/", authMiddleware, getCategory);
categoryRouter.get("/expenses", authMiddleware, getCategoriesWithBudget);

export default categoryRouter;
