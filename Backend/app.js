import express from "express";
import cors from "cors";
import directoryRoutes from "./routes/directoryRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoute from "./routes/authRoute.js";
import googleDriveRoute from "./routes/googleDriveRoute.js";
import cookieParser from "cookie-parser";
import checkAuth from "./middleware/authMiddleware.js";
import { connectDB } from "./database/db.js";
import path from "path";

import dotenv from "dotenv";
import multer from "multer";
dotenv.config();


await connectDB();

const app = express();

app.use(cookieParser(process.env.SECRET_KEY));

// serving static files
app.use(express.static("public"));
app.use("/upload", express.static(path.join(process.cwd(), "upload")));
app.use("/storage", express.static(path.join(process.cwd(), "storage")));

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
app.use("/file", fileRoutes);
app.use("/", userRoutes);
app.use("/auth", authRoute);
app.use("/google-drive", checkAuth, googleDriveRoute);

app.use((err, req, res, next) => {
  console.error("unexpected error", err);
  res.status(500).json({ error: "somethig went wrong" });
});

app.listen(process.env.PORT, () => {
  console.log(`Server Started on port ${process.env.PORT}`);
});



// kya kay abhi karna hay RBAC me 

// 1. owner acces 
// 2. roles update (same role update kar sakt ahay admin, manager )
