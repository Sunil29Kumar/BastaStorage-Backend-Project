import rateLimit from 'express-rate-limit';

export const googleLoginLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes   
    max: 9, 
    standardHeaders: true, 
    legacyHeaders: false, 
    message: {
        error: "Too many requests, please try again later after 10 minutes."
    }
});


export const githubCallbackLimiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes   
    max: 9, 
    standardHeaders: true, 
    legacyHeaders: false, 
    message: {
        error: "Too many requests, please try again later after 10 minutes."
    }
});


export const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 9,
  message: {
    statusCode: 429,
    error: "Too many requests, please try again later after 10 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
})


export const otpLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 9,
  message: {
    statusCode: 429,
    error: "Too many requests, please try again later after 10 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
})


export const registerLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 9,
  message: {
    statusCode: 429,
    error: "Too many requests, please try again later after 10 minutes."
  },
  standardHeaders: true,
  legacyHeaders: false,
})