import express from "express";
import cors from "cors";
import directoryRoutes from "./routes/directoryRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoute from "./routes/authRoute.js";

import cookieParser from "cookie-parser";
import checkAuth from "./middleware/authMiddleware.js";
import {connectDB} from "./database/db.js";

export const secretKey = "sunil-bastaStorage-app-kumar";

try {
  await connectDB();

  const app = express();

  app.use(cookieParser(secretKey));

  // parsing data comming from frontend body
  app.use(express.json());

  // allowing cors
  app.use(
    cors({
      origin: true,
      credentials: true,
    })
  );

  app.use("/directory", checkAuth, directoryRoutes);
  app.use("/file", checkAuth, fileRoutes);
  app.use("/user", userRoutes);
  app.use("/auth", authRoute);

  app.use((err, req, res, next) => {
    console.error("unexpected error", err);
    res.status(500).json({error: "somethig went wrong"});
    // res.status(500).json({error: err});
  });

  app.listen(2000, () => {
    console.log(`Server Started`);
  });
} catch (error) {
  console.log(error);
}
