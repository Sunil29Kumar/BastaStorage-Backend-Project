import dotenv from "dotenv";
dotenv.config();
import plans from "./../utils/plans.js";
import crypto from "crypto";
import Subscription from "../models/subscriptionModel.js";
import User from "../models/userModel.js";
import { sendSubscriptionMail } from "../services/mail/mailEvents.js";
import { createNotification } from "../utils/createNotification.js";
import { spawn } from "child_process"


export const razorpayWebhookHandler = async (req, res) => {

    // Verify the webhook signature
    const received_signature = req.headers["x-razorpay-signature"];
    const key = process.env.RZP_WEBHOOK_SECRET;
    const message = JSON.stringify(req.body);
    const expected_signature = crypto.createHmac("sha256", key).update(message).digest("hex");


    const data = JSON.parse(message.toString());

    if (received_signature !== expected_signature) {
        return res.status(400).json({ message: "Invalid signature" });
    }


    // Handle the webhook event

    if (req.body.event === "subscription.activated") {

        const subscription = req.body.payload.subscription?.entity;
        const payment = req.body.payload.payment?.entity;
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
        const user = await User.findByIdAndUpdate(subscriptionUpdate?.userId, {
            totalSpace: storageQuotaBytes,
            userIs: "pro",
            subscriptionTier: plans[planId]?.tier
        });

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
            message: `Your subscription to the ${plans[planId]?.tier} plan has been activated successfully.`,
        });


        return res.status(200).json({ status: "ok" });


    }

    else if (req.body.event === "subscription.paused") {   // paused

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

        return res.status(200).json({ status: "ok" });

    }

    else if (req.body.event === "subscription.resumed") {   // resumed

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

        // send subscription resumed mail
        await sendSubscriptionMail({
            type: "RESUMED",
            user: await User.findById(updatedSubscription?.userId),
            meta: { plan: plans[updatedSubscription?.planId]?.tier },
        });

        // notification about resumption
        await createNotification({
            userId: updatedSubscription.userId,
            type: "subscription",
            title: "Subscription resumed",
            message: "Your subscription has been resumed successfully."
        });

        return res.status(200).json({ status: "ok" });


    }

    // else if (req.body.event === "subscription.completed") {   // completed
    else if (req.body.event === "subscription.completed") {   // completed

        const subscription = req.body.payload.subscription.entity;
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

        return res.status(200).json({ status: "ok" });


    }

    else if (req.body.event === "subscription.cancelled") {   // cancelled

        const subscription = req.body.payload.subscription.entity;

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
            meta: { plan: plans[updatedSubscription?.planId]?.tier }
        });


        // notification about cancellation
        await createNotification({
            userId: updatedSubscription?.userId,
            type: "subscription",
            title: "Subscription cancelled",
            message: "Your subscription has been cancelled. You will continue to have access until the end of the current billing cycle."
        });

        return res.status(200).json({ status: "ok" });

    }


    return res.status(200).json({ message: "Webhook received successfully" });

}


export const githubWebhookHandler = async (req, res) => {

    // Verify the webhook signature
    const receive_signature = req.headers["x-hub-signature-256"]
    if (!receive_signature) {
        return res.status(400).json({ message: "Signature missing" });
    }
    const key = process.env.GITHUB_WEBHOOK_SECRET;
    const message = JSON.stringify(req.body);
    const expected_signature = "sha256=" + crypto.createHmac("sha256", key).update(message).digest("hex")

    if (receive_signature !== expected_signature) {
        return res.status(400).json({ message: "Invalid signature" });
    }


    const commits = req.body.commits || []
    let isPackageJsonModified = false;

    commits.forEach(commit => {
        const allChanges = [...commit.modified, ...commit.added, ...commit.removed]
        if (allChanges.includes("Backend/package.json")) {
            isPackageJsonModified = true;
        }
    })

    res.json({ message: "ok" });


    const bashchildProcess = spawn("bash", ["/home/ubuntu/deploy-backend.sh", isPackageJsonModified.toString()]);

    
    // Log the output and errors from the script
    bashchildProcess.stdout.on("data", (data) => { process.stdout.write(data) })
    bashchildProcess.stderr.on("data", (data) => { process.stderr.write(data) })

    // Handle script completion
    bashchildProcess.on("close", (code) => {
        if (code == 0) console.log("Script executed successfully");
        else console.log("Script failed");
    })

    // Handle errors in spawning the process
    bashchildProcess.on("error", (err) => {
        console.log("Error in spawning the process");
        // console.log(err);
    })
}