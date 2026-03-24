import mongoose from "mongoose";

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("Database connected successfully");
  } catch (error) {
    console.log("DB connection is failed", error);
    process.exit(1);
  }
};

export default dbConnection;
