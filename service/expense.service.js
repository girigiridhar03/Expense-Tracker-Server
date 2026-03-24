import mongoose from "mongoose";
import { AppError } from "../utils/AppError.js";
import Expense from "../model/expense.model.js";

export const addExpenseService = async (req) => {
  const userId = req.user.id;

  const { amount, category, description, date } = req.body;

  const requiredFields = ["amount", "category", "date"];

  for (let field of requiredFields) {
    if (
      req.body[field] === undefined ||
      req.body[field] === null ||
      req.body[field] === ""
    ) {
      throw new AppError(`${field} is required`, 400);
    }
  }

  if (isNaN(Number(amount)) || Number(amount) <= 0) {
    throw new AppError(`Amount must be in positive value`, 400);
  }

  if (!mongoose.isValidObjectId(category)) {
    throw new AppError(`Invalid ID: ${category}`);
  }

  const parsedDate = new Date(date);

  if (isNaN(parsedDate.getTime())) {
    throw new AppError("Invalid date format (use YYYY-MM-DD)", 400);
  }

  const month = parsedDate.getMonth() + 1;
  const year = parsedDate.getFullYear();

  let expense = await Expense.findOne({ userId, category, month, year });

  if (expense) {
    expense.amount += Number(amount);
    await expense.save();
  } else {
    expense = await Expense.create({
      userId,
      amount,
      category,
      description,
      date: parsedDate,
      month,
      year,
    });
  }

  return {
    status: 200,
    message: "expense created successfully",
    data: expense,
  };
};
