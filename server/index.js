import "dotenv/config.js";
import { app } from "./app.js";
import connectDB from "./config/mongoDB.js";

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 5000, () => {
      console.log(`Server is running on port ${process.env.PORT || 5000}`);
    });
  })
  .catch((err) => {
    console.log("MONGODB Connection FAILED:", err);
  });
