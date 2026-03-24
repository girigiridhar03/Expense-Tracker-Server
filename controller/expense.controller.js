import {
  addExpenseService,
  allExpensesService,
  deleteExpenseService,
} from "../service/expense.service.js";
import { asyncHandler } from "../utils/handler.js";
import response from "../utils/response.js";

export const addExpense = asyncHandler(async (req, res) => {
  const { status, message, data } = await addExpenseService(req);

  response(res, status, message, data);
});

export const allExpenses = asyncHandler(async (req, res) => {
  const { status, message, data } = await allExpensesService(req);
  response(res, status, message, data);
});

export const deleteExpense = asyncHandler(async (req, res) => {
  const { status, message, data } = await deleteExpenseService(req);
  response(res, status, message, data);
});
