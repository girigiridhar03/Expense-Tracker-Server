import {
  createBudgetService,
  editBudgetService,
  getBudgetService,
} from "../service/budget.service.js";
import { asyncHandler } from "../utils/handler.js";
import response from "../utils/response.js";

export const createBudget = asyncHandler(async (req, res) => {
  const { status, message, data } = await createBudgetService(req);
  response(res, status, message, data);
});

export const editBudget = asyncHandler(async (req, res) => {
  const { status, message, data } = await editBudgetService(req);

  response(res, status, message, data);
});

export const getBudget = asyncHandler(async (req, res) => {
  const { status, message, data } = await getBudgetService(req);

  response(res, status, message, data);
});
