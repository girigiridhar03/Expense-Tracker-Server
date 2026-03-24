import {
  createCategoryService,
  getCategoriesWithBudgetService,
  getCategoryService,
} from "../service/category.service.js";
import { asyncHandler } from "../utils/handler.js";
import response from "../utils/response.js";

export const createCategory = asyncHandler(async (req, res) => {
  const { status, message, data } = await createCategoryService(req);
  response(res, status, message, data);
});

export const getCategory = asyncHandler(async (req, res) => {
  const { status, message, data } = await getCategoryService(req);
  response(res, status, message, data);
});

export const getCategoriesWithBudget = asyncHandler(async (req, res) => {
  const { status, message, data } = await getCategoriesWithBudgetService(req);
  response(res, status, message, data);
});
