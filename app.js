import cookieParser from "cookie-parser";
import express from "express";
import cors from "cors";
const noCache = (req, res, next) => {
  res.set({
    "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
    Pragma: "no-cache",
    Expires: "0",
    "Surrogate-Control": "no-store",
  });
  next();
};
const app = express();
const allowedOrigin = ["http://localhost:5173"];
app.use(noCache);
app.use(express.json());
app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    credentials: true,
  }),
);
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.send({ message: "Server is up" });
});

// Router Imports
import authRouter from "./routes/auth.route.js";
import budgetRouter from "./routes/budget.route.js";
import categoryRouter from "./routes/category.route.js";
import expenseRouter from "./routes/expense.route.js";
import dashboardRouter from "./routes/dashboard.route.js";

// App Routes
app.use("/api", authRouter);
app.use("/api/budget", budgetRouter);
app.use("/api/category", categoryRouter);
app.use("/api/expense", expenseRouter);
app.use("/api/dashboard", dashboardRouter);

// Error Handler
import { errorHandler } from "./utils/handler.js";
app.use(errorHandler);

export default app;
