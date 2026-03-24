import express from "express";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { addExpense } from "../controller/expense.controller.js";

const expenseRouter = express.Router();

expenseRouter.post("/", authMiddleware, addExpense);

export default expenseRouter;
