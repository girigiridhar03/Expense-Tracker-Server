import { loginService, registrationService } from "../service/auth.service.js";
import { asyncHandler } from "../utils/handler.js";
import response from "../utils/response.js";

export const registration = asyncHandler(async (req, res) => {
  const { status, message, data } = await registrationService(req);
  response(res, status, message, data);
});

export const login = asyncHandler(async (req, res) => {
  const { status, message } = await loginService(req, res);

  response(res, status, message);
});
