import {
  authCheckService,
  authLogoutService,
  loginService,
  registrationService,
} from "../service/auth.service.js";
import { asyncHandler } from "../utils/handler.js";
import response from "../utils/response.js";

export const registration = asyncHandler(async (req, res) => {
  const { status, message, data } = await registrationService(req, res);
  response(res, status, message, data);
});

export const login = asyncHandler(async (req, res) => {
  const { status, message, data } = await loginService(req, res);

  response(res, status, message, data);
});

export const authCheck = asyncHandler(async (req, res) => {
  const { status, message, data } = await authCheckService(req);
  response(res, status, message, data);
});

export const authLogout = asyncHandler(async (_, res) => {
  const { status, message } = await authLogoutService(res);
  response(res, status, message);
});
