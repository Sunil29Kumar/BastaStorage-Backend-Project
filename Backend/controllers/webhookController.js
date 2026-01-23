import dotenv from "dotenv";
dotenv.config();
import plans from "./../utils/plans.js";
import crypto from "crypto";
import Subscription from "../models/subscriptionModel.js";
import User from "../models/userModel.js";
import { sendSubscriptionMail } from "../services/mail/mailEvents.js";
import { createNotification } from "../utils/createNotification.js";


export const razorpayWebhookHandler = async (req, res) => {

    // Verify the webhook signature
    const received_signature = req.headers["x-razorpay-signature"];
    const key = process.env.RZP_WEBHOOK_SECRET;
    // const message = JSON.stringify(req.body);
    const message = req.body
    const expected_signature = crypto.createHmac("sha256", key).update(message).digest("hex");

    console.log("webhook response");
    console.log("Raw message =",message);
    console.log("Raw message stringified =", JSON.stringify(message));

    const data = JSON.parse(message.toString());
    console.log("event name ", data.event);
    console.log("event  ", data);


    if (received_signature !== expected_signature) {
        console.log("Invalid signature:", received_signature, expected_signature);
        return res.status(400).json({ message: "Invalid signature" });
    }

    console.log("expected signiture =", expected_signature);


    // Handle the webhook event


    if (data.event === "subscription.authorized") {
        console.log("⏳ Subscription authorized, waiting for capture");
    }

    else if (data.event === "payment.captured") {
        const payment = data.payload.payment.entity;

        console.log("✅ Payment captured:", payment.id);
    }


    // if (req.body.event === "subscription.activated") {
    else if (data.event === "subscription.activated") {   // activated
        console.log("webhook active payload => ", data.payload);

        const subscription = data.payload.subscription?.entity;
        const payment = data.payload.payment?.entity;
        const planId = subscription.plan_id;

        // check if already acive plan 
        //  if already active plan exists, make this plan expired
        const existingActivePlan = await Subscription.findOneAndUpdate(
            { userId: subscription.notes.userId, status: { $in: ["active", "paused"] } },
            {
                status: "expired",
                grace: {
                    enabled: false,
                    until: null,
                },

                $push: {
                    logs: {
                        action: "expired_due_to_new_activation",
                        by: "webhook",
                        at: new Date(),
                        note: "Subscription expired due to new subscription activation"
                    }
                }

            },
        )

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
        const user = await User.findByIdAndUpdate(subscriptionUpdate?.userId, { totalSpace: storageQuotaBytes, userIs: "pro", subscriptionTier: plans[planId].tier });

        // send subscription activated mail
        await sendSubscriptionMail({
            type: "ACTIVATED",
            user: user,
            meta: { plan: plans[planId].tier },
        });

        // create notification about activation
        await createNotification({
            userId: subscriptionUpdate.userId,
            type: "subscription",
            title: "Subscription activated",
            message: `Your subscription to the ${plans[planId].tier} plan has been activated successfully.`,
        });

        // console.log("subscription activated");

    }

    else if (data.event === "subscription.paused") {   // paused

        // console.log("webhook paused payload => ", req.body.payload);
        const subscription = data.payload.subscription.entity;

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

            },
            { new: true }
        );

        // send subscription paused mailsendSubscriptionMail
        sendSubscriptionMail({
            type: "PAUSED",
            user: await User.findById(updatedSubscription?.userId),
            meta: { plan: plans[updatedSubscription?.planId].tier },
        })

        // notification about pausing
        await createNotification({
            userId: updatedSubscription.userId,
            type: "subscription",
            title: "Subscription paused",
            message: "Your subscription has been paused successfully."
        });
    }

    else if (data.event === "subscription.resumed") {   // resumed

        console.log("webhook resumed payload => ", data.payload);

        const subscription = data.payload.subscription.entity;
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

        // send subscription resumed mail
        await sendSubscriptionMail({
            type: "RESUMED",
            user: await User.findById(updatedSubscription?.userId),
            meta: { plan: plans[updatedSubscription?.planId].tier },
        });

        // notification about resumption
        await createNotification({
            userId: updatedSubscription.userId,
            type: "subscription",
            title: "Subscription resumed",
            message: "Your subscription has been resumed successfully."
        });

    }

    // else if (req.body.event === "subscription.completed") {   // completed
    else if (data.event === "subscription.completed") {   // completed

        // console.log("webhook cancelled payload => ", req.body.payload);
        const subscription = data.payload.subscription.entity;

        // Update subscription status in the database
        const updatedSubscription = await Subscription.findOneAndUpdate(
            { razorpaySubscriptionId: subscription.id },
            {
                status: "expired",
                grace: {
                    enabled: true,
                    until: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),  // 7 days grace period
                },
                $push: {
                    logs: {
                        action: "billing_cycle_completed",
                        by: "webhook",
                        at: new Date(),
                        note: "Your subscription billing cycle has completed."
                    }
                }
            },
            { new: true }
        );

        // send subscription expired mail
        await sendSubscriptionMail({
            type: "EXPIRED",
            user: await User.findById(updatedSubscription?.userId),
            meta: { graceDays: 7 }
        });


        // notify user about subscription expiry and grace period
        await createNotification({
            userId: updatedSubscription.userId,
            type: "subscription",
            title: "Subscription expired",
            message: "Your subscription has expired. You are in a 7-day grace period. Upgrade to keep your files."
        });

        // console.log("Subscription expired ");

    }

    else if (data.event === "subscription.cancelled") {   // cancelled

        // console.log("webhook cancelled payload => ", data.payload);
        const subscription = data.payload.subscription.entity;

        // Update subscription status in the database
        const updatedSubscription = await Subscription.findOneAndUpdate(
            { razorpaySubscriptionId: subscription.id },
            {
                status: "cancelled",
                cancel: { endedAt: new Date(), },
                $push: {
                    logs: {
                        action: "user_cancelled",
                        by: "webhook",
                        at: new Date(),
                        note: "User cancelled the subscription."
                    }
                }
            },
            { new: true }
        );

        // send subscription cancel mail
        await sendSubscriptionMail({
            type: "CANCELLED",
            user: await User.findById(updatedSubscription?.userId),
            meta: { plan: plans[updatedSubscription?.planId].tier }
        });


        // notification about cancellation
        await createNotification({
            userId: sub.userId,
            type: "subscription",
            title: "Subscription cancelled",
            message: "Your subscription has been cancelled. You will continue to have access until the end of the current billing cycle."
        });

        // console.log("Subscription cancelled ");

    }


    return res.status(200).json({ message: "Webhook received successfully" });

}

