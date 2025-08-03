import express from "express";
import {sendOTPUser, verifyOtp} from "../controllers/authController.js";

const route = express.Router();

route.post("/sendOtp", sendOTPUser);
route.post("/verifyOtp", verifyOtp);

export default route;
