
import dotenv from "dotenv";
dotenv.config();
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
import notificationRoutes from "./routes/notificationRoutes.js";

import { connectDB } from "./database/db.js";

import { cleanupPendingUploads } from "./cron/cleanupPendingUploads.js";
import { connectRedis } from "./database/redis.js";


// connect to database
await connectDB();

// connect to redis
await connectRedis();

// start  cron job to cleanup pending uploads
cleanupPendingUploads();

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
          process.env.CLIENT_URL || "http://localhost:5173",
          "https://checkout.razorpay.com",
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
          process.env.CLIENT_URL || "http://localhost:5173",
        ],

        // ✅ Allow connections to Google API endpoints
        "connect-src": [
          "'self'",
          "https://accounts.google.com",
          "https://apis.google.com",
          "https://www.googleapis.com",
          "https://content.googleapis.com",
          "https://drive.google.com",
          process.env.BASE_URL || "http://localhost:2000",
          process.env.CLIENT_URL || "http://localhost:5173",
        ],

        // ✅ For OAuth popups and Google Drive iframes
        "frame-src": [
          "'self'",
          "https://accounts.google.com",
          "https://drive.google.com",
          "https://content.googleapis.com",
          "https://www.gstatic.com",
          "https://api.razorpay.com", "https://checkout.razorpay.com"
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


// parsing data comming from frontend body
app.use(express.json());

// allowing cors
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:5173",
    credentials: true,
  })
);


app.get("/", (req, res) => {
  res.send("ka ho babua ?");
});

app.get("/error",(req,res)=>{
  console.log("process exit with error");
  process.exit(1)
  
})

app.use("/directory", checkAuth, directoryRoutes);
app.use("/file", fileRoutes);
app.use("/", userRoutes);
app.use("/auth", authRoute);
app.use("/google-drive", checkAuth, googleDriveRoute);

// subscription and webhook routes
app.use("/webhook", webhookRoute);
app.use("/subscription", checkAuth, subscriptionRoute);

// notifound route
app.use("/notification", checkAuth, notificationRoutes)

// global error handler middleware
app.use((err, req, res, next) => {
  // console.error("unexpected error", err);
  return res.status(500).json({ error: "somethig went wrong" });
});


app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`Server Started on port ${process.env.PORT}`);
});

