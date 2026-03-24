import { addExpenseService } from "../service/expense.service.js";
import { asyncHandler } from "../utils/handler.js";
import response from "../utils/response.js";

export const addExpense = asyncHandler(async (req, res) => {
  const { status, message, data } = await addExpenseService(req);

  response(res, status, message, data);
});
