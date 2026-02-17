import express from "express";
import { githubWebhookHandler, razorpayWebhookHandler } from "../controllers/webhookController.js";

const route = express.Router();

route.post("/razorpay", razorpayWebhookHandler)
route.post("/github", githubWebhookHandler)



export default route;