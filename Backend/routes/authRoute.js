import express from "express";
import { loginWithGoogle, sendOTPUser, verifyOtp } from "../controllers/authController.js";

const route = express.Router();

route.post("/sendOtp", sendOTPUser);
route.post("/verifyOtp", verifyOtp);
route.post("/google", loginWithGoogle);

export default route;
