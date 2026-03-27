import User from "../model/user.model.js";
import { AppError } from "../utils/AppError.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

export const registrationService = async (req, res) => {
  const { username, email, password } = req.body;

  const requiredFields = ["username", "email", "password"];

  for (let field of requiredFields) {
    if (!req.body[field]) {
      throw new AppError(`${field} is required`, 400);
    }
  }

  const userExist = await User.findOne({ email });

  if (userExist) {
    throw new AppError(`Email already taken`, 409);
  }

  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);

  const newUser = await User.create({
    username,
    email,
    password: hashPassword,
  });

  const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token, cookieOptions);

  return {
    status: 201,
    message: "user registred successfully",
    data: {
      username: newUser.username,
      email: newUser.email,
    },
  };
};

export const loginService = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !email.trim()) {
    throw new AppError("Email is required", 400);
  }
  if (!password || !password.trim()) {
    throw new AppError("Password is required", 400);
  }

  const userExist = await User.findOne({ email });

  if (!userExist) {
    throw new AppError("Invalid Credentials", 401);
  }

  const isPassword = await bcrypt.compare(password, userExist.password);

  if (!isPassword) {
    throw new AppError("Invalid Credentials", 401);
  }

  const token = jwt.sign({ id: userExist._id }, process.env.JWT_SECRET, {
    expiresIn: "1d",
  });

  res.cookie("token", token, cookieOptions);

  return {
    status: 200,
    message: "logged in successfully",
    data: {
      user: {
        id: userExist._id,
        username: userExist.username,
        email: userExist.email,
      },
    },
  };
};

export const authCheckService = async (req) => {
  const user = await User.findById(req.user.id).select("_id username email");

  if (!user) {
    throw new AppError("Unauthorized", 401);
  }

  return {
    status: 200,
    message: "Authenticated",
    data: {
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    },
  };
};

export const authLogoutService = async (res) => {
  res.clearCookie("token");
  return {
    status: 200,
    message: "Logout successfully",
  };
};
