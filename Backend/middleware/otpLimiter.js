import rateLimit from "express-rate-limit";

export const otpLimiter = rateLimit({
  windowMs: 3 * 60 * 1000, // 10 minutes
  max: 1,
  message: {
    statusCode: 429,
    error: "Too many requests, please try again later after 10 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
})