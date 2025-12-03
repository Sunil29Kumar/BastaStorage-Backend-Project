import express from "express";
import cors from "cors";
import helmet from "helmet";
import directoryRoutes from "./routes/directoryRoutes.js";
import fileRoutes from "./routes/fileRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import authRoute from "./routes/authRoute.js";

import googleDriveRoute from "./routes/googleDriveRoute.js";
import cookieParser from "cookie-parser";
import checkAuth from "./middleware/authMiddleware.js";
import subscriptionRoute from "./routes/subscriptionRoute.js";
import webhookRoute from "./routes/webhookRoute.js";

import { connectDB } from "./database/db.js";
import path from "path";

import dotenv from "dotenv";
dotenv.config();


await connectDB();

const app = express();

app.use(cookieParser(process.env.SECRET_KEY));

// csp middleware 

app.use(
  helmet({
    crossOriginEmbedderPolicy: false, // 🧩 Needed for iframes & OAuth popups
    crossOriginOpenerPolicy: false,
    crossOriginResourcePolicy: { policy: "cross-origin" }, // allow external resources

    contentSecurityPolicy: {
      useDefaults: false,
      directives: {
        "default-src": ["'self'"],

        // ✅ Allow Google scripts + frontend
        "script-src": [
          "'self'",
          "https://apis.google.com",
          "https://accounts.google.com",
          "https://drive.google.com",
          "https://www.gstatic.com",
          "http://localhost:5173",
        ],

        // // ✅ For dynamically loaded scripts (important for OAuth popup)
        "script-src-elem": [
          "'self'",
          "'unsafe-inline'",
          "'unsafe-eval'",
          "https://apis.google.com",
          "https://accounts.google.com",
          "https://drive.google.com",
          "https://www.gstatic.com",
          "http://localhost:5173",
        ],

        // ✅ Allow connections to Google API endpoints
        "connect-src": [
          "'self'",
          "https://accounts.google.com",
          "https://apis.google.com",
          "https://www.googleapis.com",
          "https://content.googleapis.com",
          "https://drive.google.com",
          "http://localhost:5000",
          "http://localhost:5173",
        ],

        // ✅ For OAuth popups and Google Drive iframes
        "frame-src": [
          "'self'",
          "https://accounts.google.com",
          "https://drive.google.com",
          "https://content.googleapis.com",
          "https://www.gstatic.com",
        ],

        // ✅ Allow images from Google Drive / user uploads
        "img-src": [
          "'self'",
          "data:",
          "blob:",
          "https://lh3.googleusercontent.com",
          "https://drive.google.com",
          "https://content.googleapis.com",
          "https://www.gstatic.com",
        ],

        // ✅ Styles and fonts
        "style-src": [
          "'self'",
          // "'unsafe-inline'",
          "https://fonts.googleapis.com",
        ],
        "font-src": [
          "'self'",
          "https://fonts.gstatic.com",
        ],

        // ✅ Worker or blob-based file uploads
        "worker-src": ["'self'", "blob:"],
      },
    },
  })
);


// serving static files
app.use(express.static("public"));
app.use("/storage/user-photo", express.static(path.join(process.cwd(), "user-photo")));
app.use("/storage/google-drive-files", express.static(path.join(process.cwd(), "google-drive-files")));
app.use("/storage", express.static(path.join(process.cwd(), "storage")));

// parsing data comming from frontend body
app.use(express.json());

// allowing cors
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  })
);



app.use("/directory", checkAuth, directoryRoutes);
app.use("/file", fileRoutes);
app.use("/", userRoutes);
app.use("/auth", authRoute);
app.use("/google-drive", checkAuth, googleDriveRoute);

// subscription and webhook routes
app.use("/webhook", webhookRoute);
app.use("/subscription",checkAuth, subscriptionRoute);


// global error handler middleware
app.use((err, req, res, next) => {
  console.error("unexpected error", err);
  return res.status(500).json({ error: "somethig went wrong" });
});


app.listen(process.env.PORT, () => {
  console.log(`Server Started on port ${process.env.PORT}`);
});

