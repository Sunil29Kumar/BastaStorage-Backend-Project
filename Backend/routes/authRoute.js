import express from "express";
import {  githubCallback, googleCallback, loginWithGithub, loginWithGoogle, recoverAccount, requestRecovery, sendOTPUser, setGooglePassword, verifyOtp } from "../controllers/authController.js";
import { googleDriveAuthUrl } from "../utils/googleDriveAuthService.js";
import checkAuth from "../middleware/authMiddleware.js";
import { blockIfExpired, blockIfPaused } from "../middleware/subscriptionMiddleware.js";
import { githubCallbackLimiter, googleLoginLimiter, otpLimiter } from "../middleware/Rate Limiter/authLimiter.js";

const route = express.Router();

route.post("/sendOtp", otpLimiter, sendOTPUser);
route.post("/verifyOtp", verifyOtp);

route.get("/github", loginWithGithub);
route.get("/github/callback", githubCallbackLimiter, githubCallback);

route.post("/google/login", googleLoginLimiter, loginWithGoogle);
// set google password 
route.post("/google/set-password", checkAuth, setGooglePassword);

route.get("/google/drive", googleDriveAuthUrl);
route.get("/google/callback", checkAuth, googleCallback);

// recovery account 
route.post("/recover-request", requestRecovery)

route.post("/recover-account", recoverAccount);

export default route;
