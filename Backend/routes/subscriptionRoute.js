import express from "express";
import { createSubscription, getCurrentSubscription, getSubscriptionStatus, pauseSubscription, resumeSubscription } from "../controllers/subscriptionController.js";

const route = express.Router();

route.post("/", createSubscription)

route.get("/status/:subscriptionId", getSubscriptionStatus)

// get current subscription of user
route.get("/current", getCurrentSubscription)

// pause subscription
route.post("/pause/:subscriptionId", pauseSubscription)

// resume subscription
route.post("/resume/:subscriptionId",resumeSubscription)


export default route;