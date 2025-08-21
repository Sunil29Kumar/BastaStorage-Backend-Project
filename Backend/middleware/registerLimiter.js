import rateLimit from "express-rate-limit";

export const registerLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5,
  message: {
    statusCode: 429,
    error: "Too many requests, please try again later after 1 hour."
  },
  standardHeaders: true,
  legacyHeaders: false,
})