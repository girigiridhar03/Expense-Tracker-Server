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

  let expense = await Expense.create({
    userId,
    amount,
    category,
    description,
    date: parsedDate,
    month,
    year,
  });

  return {
    status: 200,
    message: "expense created successfully",
    data: expense,
  };
};

export const allExpensesService = async (req) => {
  let { page, pageSize, category, month, year } = req.query;

  page = parseInt(page) || 1;
  pageSize = parseInt(pageSize) || 15;
  const skip = (page - 1) * pageSize;

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

  const queryObj = {
    month,
    year,
  };

  if (category) {
    queryObj.category = category;
  }

  const expenses = await Expense.find(queryObj)
    .populate("category", "-userId -createdAt -updatedAt")
    .sort({ createdAt: -1, category: 1 })
    .skip(skip)
    .limit(pageSize)
    .select("-userId -createdAt -updatedAt");

  if (!expenses.length) {
    return {
      status: 200,
      message: "No expenses",
      data: {
        expenses: [],
        page,
        pageSize,
        totalPages: 1,
        totalRecords: 0,
      },
    };
  }

  const totalRecords = await Expense.countDocuments(queryObj);

  return {
    status: 200,
    message: "Expenses Fetched successfully",
    data: {
      expenses,
      page,
      pageSize,
      totalPages: Math.ceil(totalRecords / pageSize),
      totalRecords,
    },
  };
};

export const deleteExpenseService = async (req) => {
  const id = req.params.id;

  if (!id) {
    throw new AppError("Expense ID is required", 400);
  }

  if (!mongoose.isValidObjectId(id)) {
    throw new AppError(`Invalid Expense ID: ${id}`, 409);
  }

  const deletedExpense = await Expense.findByIdAndDelete(id);

  if (!deletedExpense) {
    throw new AppError(`Expense not found`, 404);
  }

  return {
    status: 200,
    message: "Expense Deleted Successfully",
    data: deletedExpense,
  };
};
