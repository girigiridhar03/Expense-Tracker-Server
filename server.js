import dotenv from "dotenv";
dotenv.config();
import dbConnection from "./config/db.config.js";
import app from "./app.js";

const port = process.env.PORT || 8080;
dbConnection()
  .then(() => {
    app.listen(port, () => {
      console.log(`Server is listening to port: ${port}`);
    });
  })
  .catch((err) => {
    console.log("connection failed", err);
    process.exit(1);
  });
