import rateLimit from "express-rate-limit";

export const otpLimiter = rateLimit({
  windowMs: 30 * 60 * 1000, // 30 minutes
  max: 10,
  message: {
    statusCode: 429,
    error: "Too many requests, please try again later after 30 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
})