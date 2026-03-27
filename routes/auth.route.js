import express from "express";
import {
  authCheck,
  authLogout,
  login,
  registration,
} from "../controller/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const authRouter = express.Router();

authRouter.post("/register", registration);
authRouter.post("/login", login);
authRouter.get("/auth/check", authMiddleware, authCheck);
authRouter.get("/logout", authLogout);

export default authRouter;
