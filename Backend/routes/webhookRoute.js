import express from "express";
import { razorpayWebhookHandler } from "../controllers/webhookController.js";

const route = express.Router();

route.post("/razorpay", razorpayWebhookHandler)



export default route;