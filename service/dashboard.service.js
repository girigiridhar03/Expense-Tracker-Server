import mongoose from "mongoose";
import Budget from "../model/budget.model.js";
import Expense from "../model/expense.model.js";

export const budgetMetricService = async (req) => {
  const userId = req.user.id;
  const todaysDate = new Date();
  const month = Number(todaysDate.getMonth() + 1);
  const year = Number(todaysDate.getFullYear());

  const budget = await Budget.findOne({ userId, month, year });
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
