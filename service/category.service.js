import Budget from "../model/budget.model.js";
import Category from "../model/category.model.js";
import Expense from "../model/expense.model.js";
import { AppError } from "../utils/AppError.js";

export const createCategoryService = async (req) => {
  const { categoryName, categoryEmoji, bgColor } = req.body;

  const requiredFields = ["categoryName", "categoryEmoji", "bgColor"];

  for (let field of requiredFields) {
    if (
      req.body[field] === undefined ||
      req.body[field] === "" ||
      req.body[field] === null
    ) {
      throw new AppError(`${field} is required`, 400);
    }
  }

  const normalizedCategoryName = categoryName.trim().toLowerCase();
  const categoryExist = await Category.findOne({
    categoryName: normalizedCategoryName,
  });

  if (categoryExist) {
    throw new AppError("Category Already Exist", 400);
  }

  const isValidHex = /^#([0-9A-F]{3}){1,2}$/i.test(bgColor);
  if (!isValidHex) {
    throw new AppError("Invalid color format", 400);
  }

  const newCategory = await Category.create({
    categoryName: normalizedCategoryName,
    categoryEmoji,
    bgColor,
    ...(req?.user?.id ? { userId: req?.user?.id } : {}),
  });

  return {
    status: 201,
    message: "Category Created Successfully",
    data: newCategory,
  };
};

export const getCategoryService = async (req) => {
  const userId = req.user.id;

  const categories = await Category.find({
    $or: [{ userId: null }, { userId }],
  })
    .sort({ categoryName: 1, userId: 1 })
    .select("-createdAt -updatedAt")
    .lean();

  const updatedCategories = categories?.map((item) => ({
    ...item,
    isDefault: item?.userId === null,
  }));

  return {
    status: 200,
    message: "Categories fetched successfully",
    data: updatedCategories,
  };
};

export const getCategoriesWithBudgetService = async (req) => {
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

  let categories = await Category.find({
    $or: [{ userId: null }, { userId }],
  })
    .select("-createdAt -updatedAt")
    .lean();

  if (!categories?.length) {
    throw new AppError("No Categories Found", 404);
  }

  const budgetWithCategory = await Budget.find({
    userId,
    month,
    year,
    categoryId: {
      $ne: null,
    },
  })
    .select("categoryId amount")
    .lean();

  const budgetCategoryObj = budgetWithCategory.reduce((acc, curr) => {
    acc[curr.categoryId] = curr.amount;
    return acc;
  }, {});

  const expenseByCategory = await Expense.find({
    userId,
    month,
    year,
    category: {
      $ne: null,
    },
  })
    .select("category amount")
    .lean();
  const expenseCategoryObj = expenseByCategory.reduce((acc, curr) => {
    acc[curr.category] = (acc[curr.category] || 0) + curr.amount;
    return acc;
  }, {});

  categories = categories?.map((item) => {
    const budget = budgetCategoryObj[item._id] || 0;
    const spent = expenseCategoryObj[item._id] || 0;
    return {
      ...item,
      amount: budget,
      spent,
      remaining: budget ? budget - spent : 0,
      percentage: budget ? (spent / budget) * 100 : 0,
    };
  });

  return {
    status: 200,
    message: "Category Budget Fetched Successfully",
    data: categories,
  };
};
