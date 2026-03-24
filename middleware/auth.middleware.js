import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "Token is required",
      });
    }
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (error) {
      return res.status(401).json({
        message: "Unauthorized",
      });
    }

    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    return {
      status: 500,
      message: "Internal server Error",
    };
  }
};
