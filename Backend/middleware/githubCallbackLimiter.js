import rateLimit from 'express-rate-limit';

export const githubCallbackLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 15 minutes   
    max: 50, // Limit each IP to 100 requests per windowMs
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        error: "Too many requests, please try again later after 15 minutes."
    }
});
