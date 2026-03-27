import mongoose from "mongoose";
import Budget from "../model/budget.model.js";
import Expense from "../model/expense.model.js";
import { budgetUtils, todayDate } from "../utils/utils.js";

export const budgetMetricService = async (req) => {
  const userId = req.user.id;
  const { month, year } = todayDate();

  const budget = await Budget.findOne({
    userId,
    month,
    year,
    categoryId: { $eq: null },
  });
  const expense = await Expense.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        month,
        year,
      },
    },
    {
      $group: {
        _id: null,
        totalSpent: { $sum: "$amount" },
        categories: { $addToSet: "$category" },
      },
    },
    {
      $project: {
        _id: 0,
        totalSpent: 1,
        categoriesUsed: { $size: "$categories" },
        remaining: {
          $subtract: [budget.amount, "$totalSpent"],
        },
        percentage: {
          $cond: {
            if: { $eq: [budget.amount, 0] },
            then: 0,
            else: {
              $multiply: [
                {
                  $divide: [
                    { $subtract: [budget.amount, "$totalSpent"] },
                    budget.amount,
                  ],
                },
                100,
              ],
            },
          },
        },
      },
    },
  ]);

  if (!budget || !expense.length) {
    return {
      status: 200,
      message: "No Metrics",
      data: {
        totalSpent: 0,
        monthlyBudget: 0,
        remaining: 0,
        percentage: 0,
        categoriesUsed: 0,
      },
    };
  }

  const expenseMetric = expense[0];

  return {
    status: 200,
    message: "Metrics Fetched Successfully",
    data: {
      totalSpent: expenseMetric.totalSpent || 0,
      monthlyBudget: budget.amount || 0,
      remaining: expenseMetric.remaining || 0,
      percentage: Math.floor(expenseMetric.percentage || 0),
      categoriesUsed: expenseMetric.categoriesUsed || 0,
    },
  };
};

export const budgetOverviewService = async (req) => {
  const userId = req.user.id;
  const { month, year } = todayDate();

  const budgetDetails = await budgetUtils({
    Budget,
    Expense,
    userId,
    month,
    year,
  });

  const allocatedCategoriesBudget = await Budget.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        month,
        year,
        categoryId: {
          $ne: null,
        },
      },
    },
    {
      $group: {
        _id: "$categoryId",
        allocatedAmount: { $sum: "$amount" },
      },
    },
  ]);

  return {
    status: 200,
    message: "Budget Overview Fetched Successfully",
    data: {
      amount: budgetDetails?.amount,
      totalSpent: budgetDetails?.totalSpent,
      remaining: budgetDetails?.remaining,
      percentage: budgetDetails?.percentage,
      allocatedAmount: allocatedCategoriesBudget?.[0]?.allocatedAmount || 0,
    },
  };
};

export const pieCategoriesService = async (req) => {
  const userId = req.user.id;
  const { month, year } = todayDate();

  const categories = await Expense.aggregate([
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        month,
        year,
      },
    },
    {
      $lookup: {
        from: "categories",
        localField: "category",
        foreignField: "_id",
        as: "categoryDetails",
      },
    },
    {
      $unwind: "$categoryDetails",
    },
    {
      $group: {
        _id: {
          id: "$categoryDetails._id",
          name: "$categoryDetails.categoryName",
          color: "$categoryDetails.bgColor",
        },
        totalAmount: { $sum: "$amount" },
      },
    },
    {
      $project: {
        _id: "$_id.id",
        name: "$_id.name",
        color: "$_id.color",
        totalAmount: 1,
      },
    },
  ]);

  return {
    status: 200,
    message: "Fetched Categories Details Successfully",
    data: categories,
  };
};
