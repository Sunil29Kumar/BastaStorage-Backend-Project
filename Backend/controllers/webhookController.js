import dotenv from "dotenv";
dotenv.config();
import plans from "./../utils/plans.js";
import crypto from "crypto";
import Subscription from "../models/subscriptionModel.js";
import User from "../models/userModel.js";


export const razorpayWebhookHandler = async (req, res) => {

    // Verify the webhook signature
    const received_signature = req.headers["x-razorpay-signature"];
    const key = process.env.RZP_WEBHOOK_SECRET;
    const message = JSON.stringify(req.body);
    const expected_signature = crypto.createHmac("sha256", key).update(message).digest("hex");

    console.log("webhook response");


    if (received_signature !== expected_signature) {
        console.log("Invalid signature:", received_signature, expected_signature);
        return res.status(400).json({ message: "Invalid signature" });
    }


    // Handle the webhook event
    if (req.body.event === "subscription.activated") {
        console.log("webhook active payload => ", req.body.payload);

        const subscription = req.body.payload.subscription?.entity;
        const payment = req.body.payload.payment?.entity;
        const planId = subscription.plan_id;

        // update subscription status in DB
        const subscriptionUpdate = await Subscription.findOneAndUpdate(
            { razorpaySubscriptionId: subscription?.id },
            {
                // MAIN subscription fields
                planId: subscription.plan_id,
                status: subscription.status,
                customerId: subscription.customer_id,

                startAt: new Date(subscription.start_at * 1000),
                currentStart: new Date(subscription.current_start * 1000),
                currentEnd: new Date(subscription.current_end * 1000),
                chargeAt: new Date(subscription.charge_at * 1000),

                billing: {
                    totalCount: subscription.total_count,
                    paidCount: subscription.paid_count,
                    remainingCount: subscription.remaining_count,
                    // currentCycle: subscription.current_cycle,
                    quantity: subscription.quantity,
                },

                notes: subscription.notes,

                // PAYMENT DETAILS
                payment: {
                    paymentId: payment.id,
                    paymentStatus: payment.status,
                    paymentMethod: payment.method,
                    paymentAmount: payment.amount / 100,
                    paymentFee: payment.fee,
                    paymentCurrency: payment.currency,
                },

                orderId: payment.order_id,
                invoiceIds: payment.invoice_id ? [payment.invoice_id] : [],

                $push: {
                    logs: {
                        action: "activated",
                        by: "webhook",
                        at: new Date(),
                        note: "Payment successful, subscription active"
                    }
                },
            },
            { new: true }
        );

        // update user's total space based on plan
        const storageQuotaBytes = plans[planId].storageQuotaBytes;
        await User.findByIdAndUpdate(subscriptionUpdate?.userId, { totalSpace: storageQuotaBytes, userIs: "pro", subscriptionTier: plans[planId].tier });

        console.log("subscription activated");

    }

    else if (req.body.event === "subscription.paused") {   // paused

        console.log("webhook paused payload => ", req.body.payload);
        const subscription = req.body.payload.subscription.entity;

        // Update subscription status in the database
        const updatedSubscription = await Subscription.findOneAndUpdate(
            { razorpaySubscriptionId: subscription.id },
            {
                status: "paused",
                $push: {
                    pauseAt: new Date(),
                    logs: {
                        action: "paused",
                        by: "webhook",
                        at: new Date(),
                        note: "Subscription paused"
                    }
                },
                // $push: {

                // }
            },
            { new: true }
        );
    }

    else if (req.body.event === "subscription.resumed") {   // resumed

        console.log("webhook resumed payload => ", req.body.payload);

        const subscription = req.body.payload.subscription.entity;
        // Update subscription status in the database
        const updatedSubscription = await Subscription.findOneAndUpdate(
            { razorpaySubscriptionId: subscription.id },
            {
                status: "active",
                $push: {
                    resumeAt: new Date(),
                    logs: {
                        action: "resumed",
                        by: "webhook",
                        at: new Date(),
                        note: "Subscription resumed"
                    }
                },

            },
            { new: true }
        );
    }

    else if (req.body.event === "subscription.completed" || req.body.event === "subscription.cancelled") {   // completed

        console.log("webhook cancelled payload => ", req.body.payload);
        const subscription = req.body.payload.subscription.entity;

        // Update subscription status in the database
        const updatedSubscription = await Subscription.findOneAndUpdate(
            { razorpaySubscriptionId: subscription.id },
            {
                status: "expired",
                cancel: {
                    endedAt: new Date(),
                },
                grace: {
                    enabled: true,
                     until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),  // 7 days grace period
                },
                $push: {
                    logs: {
                        action: "grace_started",
                        by: "webhook",
                        at: new Date(),
                        note: "7 days grace period started on subscription expiry/cancellation"
                    }
                }
            },
            { new: true }
        );

        if (updatedSubscription) {
            await User.findByIdAndUpdate(updatedSubscription?.userId, { userIs: "free", subscriptionTier: "free", totalSpace: plans["free"].storageQuotaBytes });
        }

        console.log("Subscription expired & user downgraded");

    }


    return res.status(200).json({ message: "Webhook received successfully" });

}

