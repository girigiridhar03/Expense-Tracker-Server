import mongoose from "mongoose";

export const budgetUtils = async ({ Budget, Expense, userId, month, year }) => {
  const budget = await Budget.findOne({
    userId,
    month,
    year,
    categoryId: {
      $eq: null,
    },
  })
    .select("amount month year")
    .lean();
  const spent = await Expense.aggregate([
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
        totalSpent: {
          $sum: "$amount",
        },
      },
    },
  ]);

  return {
    amount: budget?.amount ?? 0,
    month,
    year,
    totalSpent: spent?.[0]?.totalSpent ?? 0,
    remaining: (budget?.amount ?? 0) - (spent?.[0]?.totalSpent ?? 0),
    percentage: budget?.amount
      ? ((spent?.[0]?.totalSpent ?? 0) / budget.amount) * 100
      : 0,
  };
};

export const todayDate = () => {
  const todaysDate = new Date();
  const month = Number(todaysDate.getMonth() + 1);
  const year = Number(todaysDate.getFullYear());

  return {
    todayDate,
    month,
    year,
  };
};
