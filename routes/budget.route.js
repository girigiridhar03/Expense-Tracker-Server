import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  createBudget,
  editBudget,
  getBudget,
} from "../controller/budget.controller.js";

const budgetRouter = express.Router();

budgetRouter.get("/", authMiddleware, getBudget);
budgetRouter.post("/", authMiddleware, createBudget);
budgetRouter.patch("/:id", authMiddleware, editBudget);

export default budgetRouter;
