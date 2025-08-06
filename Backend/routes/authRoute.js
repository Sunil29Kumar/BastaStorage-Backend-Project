import express from "express";
import { githubCallback, loginWithGithub, loginWithGoogle, sendOTPUser, verifyOtp } from "../controllers/authController.js";
import { githubCallbackLimiter } from "../middleware/githubCallbackLimiter.js";
import { googleLimiter } from "../middleware/googleCallbackLimiter.js";

const route = express.Router();

route.post("/sendOtp", sendOTPUser);
route.post("/verifyOtp", verifyOtp);
route.post("/google", googleLimiter, loginWithGoogle);
route.get("/github", loginWithGithub);
route.get("/github/callback", githubCallbackLimiter, githubCallback);

export default route;
