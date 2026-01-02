import express from "express";
import { cancelSubscription, createSubscription, getCurrentSubscription, getInvoice, getSubscriptionStatus, pauseSubscription, resumeSubscription } from "../controllers/subscriptionController.js";
import { blockIfExpired, blockIfPaused } from "../middleware/subscriptionMiddleware.js";

const route = express.Router();

route.post("/", blockIfPaused, createSubscription)

route.get("/status/:subscriptionId", getSubscriptionStatus)

// get current subscription of user
route.get("/current", getCurrentSubscription)

// pause subscription
route.post("/pause/:subscriptionId", blockIfExpired, pauseSubscription)

// resume subscription
route.post("/resume/:subscriptionId", blockIfExpired, resumeSubscription)


// cancel subscription
route.post("/cancel/:subscriptionId",blockIfExpired, blockIfPaused, cancelSubscription)

// invoice 
route.get("/invoice/:subscriptionId", getInvoice)


export default route;