
import dotenv from "dotenv";
dotenv.config({ quiet: true });
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



// Connect to MongoDB
await connectDB();

// Connect to Redis
await connectRedis();


const app = express();

app.set('trust proxy', 1);

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
          process.env.CLIENT_URL,
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
          process.env.CLIENT_URL,
        ],

        // ✅ Allow connections to Google API endpoints
        "connect-src": [
          "'self'",
          "https://accounts.google.com",
          "https://apis.google.com",
          "https://www.googleapis.com",
          "https://content.googleapis.com",
          "https://drive.google.com",
          process.env.BASE_URL,
          process.env.CLIENT_URL,
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


// Middlewares
app.use(express.json());
app.use(cookieParser(process.env.SECRET_KEY));


// Allowing CORS
const whitelist = [
  process.env.CLIENT_URL_1,
  process.env.CLIENT_URL_2,
];

app.use(
  cors({
    origin: function (origin, callback) {
      // origin undefined hota hai agar request direct (jaise Postman) se aaye
      if (!origin || whitelist.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);


// Protected routes
app.use("/subscription", checkAuth, subscriptionRoute);
app.use("/file", fileRoutes);
app.use("/directory", checkAuth, directoryRoutes);
app.use("/", userRoutes);

// Public routes
app.use("/auth", authRoute);
app.use("/google-drive", checkAuth, googleDriveRoute);
app.use("/webhook", webhookRoute);

app.use("/notification", checkAuth, notificationRoutes)


app.get("/", (req, res) => {
  res.send("BastaStorage Backend running...");
});


// global error handler 
app.use((err, req, res, next) => {
  return res.status(500).json({ error: "somethig went wrong" });
});


app.listen(process.env.PORT, "0.0.0.0", () => {
  console.log(`Server Started on port ${process.env.PORT}`);

  // start  cron job 
  cleanupPendingUploads();

});
