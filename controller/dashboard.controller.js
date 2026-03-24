import {
  budgetMetricService,
  budgetOverviewService,
  pieCategoriesService,
} from "../service/dashboard.service.js";
import { asyncHandler } from "../utils/handler.js";
import response from "../utils/response.js";

export const budgetMetric = asyncHandler(async (req, res) => {
  const { status, message, data } = await budgetMetricService(req);
  response(res, status, message, data);
});

export const budgetOverview = asyncHandler(async (req, res) => {
  const { status, message, data } = await budgetOverviewService(req);
  response(res, status, message, data);
});

export const pieCategories = asyncHandler(async (req, res) => {
  const { status, message, data } = await pieCategoriesService(req);

  response(res, status, message, data);
});
