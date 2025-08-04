import express from "express";
import { githubCallback, loginWithGithub, loginWithGoogle, sendOTPUser, verifyOtp } from "../controllers/authController.js";

const route = express.Router();

route.post("/sendOtp", sendOTPUser);
route.post("/verifyOtp", verifyOtp);
route.post("/google", loginWithGoogle);
route.get("/github", loginWithGithub);
route.get("/github/callback", githubCallback);

export default route;
