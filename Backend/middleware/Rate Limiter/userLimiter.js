import rateLimit from 'express-rate-limit';

export const profileUpdateLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 60 minutes   
    max: 20,
    standardHeaders: true,
    legacyHeaders: false,
    message: {
        error: "Too many requests, please try again later after 60 minutes."
    }
});
