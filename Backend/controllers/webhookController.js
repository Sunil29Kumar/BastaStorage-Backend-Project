import plans from "./../utils/plans.js";
import crypto from "crypto";
import dotenv from "dotenv";
import Subscription from "../models/subscriptionModel.js";
import User from "../models/userModel.js";
dotenv.config();

export const razorpayWebhookHandler = async (req, res) => {

    // Verify the webhook signature
    const received_signature = req.headers["x-razorpay-signature"];
    const key = process.env.RZP_WEBHOOK_SECRET;
    const message = JSON.stringify(req.body);
    const expected_signature = crypto.createHmac("sha256", key).update(message).digest("hex");
    if (received_signature !== expected_signature) {
        return res.status(400).json({ message: "Invalid signature" });
    }

    // Handle the webhook event
    if (req.body.event === "subscription.activated") {
        console.log("webhook payload => ", req.body.payload);

        const subscription = req.body.payload.subscription.entity;
        const planId = subscription.plan_id;

        // update subscription status in db
        const subscriptionUpdate = await Subscription.findOneAndUpdate(
            { razorpaySubscriptionId: subscription.id },
            { status: subscription.status }
        );
        

        // update user's total space based on plan
        const storageQuotaBytes = plans[planId].storageQuotaBytes;
        await User.findByIdAndUpdate(subscriptionUpdate.userId, { totalSpace: storageQuotaBytes });

        console.log("subscription activated");
        


    } else {
        console.log("Event not handled");
    }

    res.end("ok")



}

