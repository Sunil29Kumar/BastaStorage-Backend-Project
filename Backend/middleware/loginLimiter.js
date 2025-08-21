import rateLimit from "express-rate-limit";

export const loginLimiter = rateLimit({
  windowMs: 20 * 60 * 1000, // 10 minutes
  max: 10,
  message: {
    statusCode: 429,
    error: "Too many requests, please try again later after 20 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
})