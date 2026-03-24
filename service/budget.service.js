import mongoose from "mongoose";
import { AppError } from "../utils/AppError.js";
import Budget from "../model/budget.model.js";
import Expense from "../model/expense.model.js";
import { budgetUtils } from "../utils/utils.js";

export const createBudgetService = async (req) => {
  const { categoryId, amount, month, year } = req.body;

  const requiredFields = ["amount", "month", "year"];

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
    throw new AppError("Amount must be a positive number", 400);
  }

  if (isNaN(Number(month)) || Number(month) <= 0 || Number(month) > 12) {
    throw new AppError("Month need to between 1 to 12", 400);
  }

  if (isNaN(Number(year)) || Number(year) <= 0) {
    throw new AppError("Year must be a positive number", 400);
  }

  if (categoryId && !mongoose.isValidObjectId(categoryId)) {
    throw new AppError(`Invalid CategoryId: ${categoryId}`, 409);
  }
  const query = {
    userId: req.user.id,
    month: Number(month),
    year: Number(year),
    ...(categoryId && { categoryId }),
  };

  const existing = await Budget.findOne(query);

  if (existing) {
    throw new AppError("Budget Already exists for this month", 400);
  }

  const newBudget = await Budget.create({
    userId: req.user.id,
    amount: Number(amount),
    month: Number(month),
    year: Number(year),
    ...(categoryId && { categoryId }),
  });

  return {
    status: 201,
    message: "New Budget is created successfully",
    data: newBudget,
  };
};

export const editBudgetService = async (req) => {
  const { id } = req.params;
  const amount = req.body.amount;

  if (!id) {
    throw new AppError("ID is required", 400);
  }

  if (!mongoose.isValidObjectId(id)) {
    throw new AppError(`Invalid ID: ${id}`, 409);
  }

  if (amount === undefined || isNaN(Number(amount))) {
    throw new AppError("Amount must be a valid number", 400);
  }
  if (Number(amount) <= 0) {
    throw new AppError("Amount must be greater than 0", 400);
  }

  const updatedBudget = await Budget.findByIdAndUpdate(
    id,
    {
      $set: {
        amount,
      },
    },
    {
      returnDocument: "after",
    },
  );

  if (!updatedBudget) {
    throw new AppError("No Record found", 404);
  }

  return {
    status: 200,
    message: "Updated successfully",
    data: updatedBudget,
  };
};

export const getBudgetService = async (req) => {
  let { month, year } = req.query;
  const userId = req.user.id;

  if (month === undefined || month === "") {
    throw new AppError("Month is required", 400);
  }
  month = Number(month);
  if (isNaN(month)) {
    throw new AppError("Month must be valid number", 400);
  }

  if (month <= 0 || month > 12) {
    throw new AppError("Month must be between 1 and 12", 400);
  }

  if (year === undefined || year === "") {
    throw new AppError("Year is required", 400);
  }

  year = Number(year);

  if (isNaN(year)) {
    throw new AppError("Year must be valid number", 400);
  }

  const data = await budgetUtils({ Budget, Expense, userId, month, year });

  return {
    status: 200,
    message: "Budget fetched successfully",
    data,
  };
};
