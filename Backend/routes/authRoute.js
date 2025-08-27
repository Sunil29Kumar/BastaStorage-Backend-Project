import express from "express";
import { githubCallback, googleCallback, googleDriveFilesFolder, loginWithGithub, loginWithGoogle, recoverAccount, requestRecovery, sendOTPUser, setGooglePassword, verifyOtp } from "../controllers/authController.js";
import { githubCallbackLimiter } from "../middleware/githubCallbackLimiter.js";
import { googleLimiter } from "../middleware/googleCallbackLimiter.js";
import { otpLimiter } from "../middleware/otpLimiter.js";
import { googleDriveAuthUrl } from "../utils/googleDriveAuthService.js";
import checkAuth from "../middleware/authMiddleware.js";

const route = express.Router();

route.post("/sendOtp", otpLimiter, sendOTPUser);
route.post("/verifyOtp", verifyOtp);

route.get("/github", loginWithGithub);
route.get("/github/callback", githubCallbackLimiter, githubCallback);

route.post("/google/login", loginWithGoogle);
// set google password 
route.post("/google/set-password",checkAuth, setGooglePassword);

route.get("/google/drive", googleDriveAuthUrl);
route.get("/google/callback", checkAuth, googleCallback);
route.get("/google/list-file", checkAuth, googleDriveFilesFolder);

// recovery account 
route.post("/recover-request", requestRecovery)

route.post("/recover-account", recoverAccount);

export default route;
