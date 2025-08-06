import rateLimit from "express-rate-limit";

export const googleLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 2,
  message: {
    error: "Too many requests, please try again later after 10 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
})