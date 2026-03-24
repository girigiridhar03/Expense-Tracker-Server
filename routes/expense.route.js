import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import {
  addExpense,
  allExpenses,
  deleteExpense,
} from "../controller/expense.controller.js";

const expenseRouter = express.Router();

expenseRouter.post("/", authMiddleware, addExpense);
expenseRouter.get("/", authMiddleware, allExpenses);

// Dynamic Routes
expenseRouter.patch("/:id", authMiddleware, deleteExpense);

export default expenseRouter;
