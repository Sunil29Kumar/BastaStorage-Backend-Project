import rateLimit from "express-rate-limit";

export const adminActionLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 50,                 // VERY limited
  message: {
    error: "Admin action limit exceeded. Try again later."
  },
  standardHeaders: true,
  legacyHeaders: false,
});
