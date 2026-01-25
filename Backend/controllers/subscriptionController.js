import dotenv from "dotenv";
dotenv.config();
import Subscription from "../models/subscriptionModel.js";
import razor from "../utils/razorpay.js";
import { sendSubscriptionMail } from "../services/mail/mailEvents.js";
import User from "../models/userModel.js";
import { createNotification } from "../utils/createNotification.js";


export const createSubscription = async (req, res) => {
    try {
        const { planId } = req.body;

        // fetch plan 
        const plan = await razor.plans.fetch(planId);
        if (!plan) {
            return res.status(404).json({ error: "Plan not found" });
        }

        const totalCount = plan.period === 'monthly' ? 12 : 1;


        // Create subscription on Razorpay
        const subscription = await razor.subscriptions.create({
            plan_id: planId,
            total_count: totalCount,
            customer_notify: 1,
            notes: {
                userId: req.user._id.toString()
            }
        });



        // check existing user subscription for same plan
        const existingSubscription = await Subscription.findOne({ userId: req.user._id, planId: planId, status: { $in: ["active", "paused"] } });
        if (existingSubscription) {
            return res.status(404).json({ error: "This Plan already On Boarding" })
        }


        // Save New subscription in DB
        const newSubscription = new Subscription({
            razorpaySubscriptionId: subscription.id,
            planId: planId,
            userId: req.user._id,
            logs: [{ action: "created", at: new Date(), by: "system", note: "Subscription created" }]
        });

        await newSubscription.save();

        console.log("add new subscription in db");

        console.log("new Subscription =", newSubscription);

        return res.status(200).json({ subscriptionId: subscription.id, });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to create subscription" });
    }
};

// Get subscription status
export const getSubscriptionStatus = async (req, res) => {
    try {
        const { subscriptionId } = req.params;
        // Fetch subscription from Razorpay
        const subscription = await razor.subscriptions.fetch(subscriptionId);
        if (!subscription) {
            return res.status(404).json({ error: "Subscription not found" });
        }
        return res.status(200).json({ status: subscription.status });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch subscription status" });
    }
};

// current subscription
export const getCurrentSubscription = async (req, res) => {
    try {
        const subscription = await Subscription.findOne({ userId: req.user._id, status: { $in: ["active", "paused"] } });
        if (!subscription) {
            return res.status(404).json({ error: "No subscription found for this user" });
        }
        return res.status(200).json({ subscription });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch current subscription" });
    }
};


// invoice
export const getInvoice = async (req, res) => {
    try {
        const { subscriptionId } = req.params;

        const userId = req.user._id;

        // Verify invoice belongs to user's subscription
        const subscriptionRecord = await Subscription.findOne({ userId, razorpaySubscriptionId: subscriptionId });
        if (!subscriptionRecord) {
            return res.status(404).json({ error: "Invoice not found for this user" });
        }

        // Fetch invoice from Razorpay
        const invoices = [];

        // Jo invoice IDs tum webhook me store karte ho
        for (const invoiceId of subscriptionRecord.invoiceIds) {
            const invoice = await razor.invoices.fetch(invoiceId);

            invoices.push({ short_url: invoice?.short_url, amountPaid: invoice?.amount_paid, billingDate: invoice?.billing_start });
        }


        return res.status(200).json({ invoices });
    } catch (error) {
        return res.status(500).json({ error: "Failed to get invoice" });
    }
}


// pause subscription
export const pauseSubscription = async (req, res) => {
    try {
        const { subscriptionId } = req.params;
        console.log("subid=", subscriptionId);

        const userId = req.user._id;

        // Verify subscription belongs to user
        const subscriptionRecord = await Subscription.findOne({ razorpaySubscriptionId: subscriptionId, userId });
        if (!subscriptionRecord) {
            return res.status(404).json({ error: "Subscription not found for this user" });
        }

        // Pause subscription on Razorpay
        const pausedSubscription = await razor.subscriptions.pause(subscriptionId, {
            pause_at: "cycle_end",
            resume_at: null,
            reason: "User requested pause"
        });
        if (!pausedSubscription) {
            return res.status(404).json({ error: "Subscription not found or could not be paused" });
        }

        return res.status(200).json({ message: "Subscription paused successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to pause subscription" });
    }
};


// resume subscription
export const resumeSubscription = async (req, res) => {
    try {
        const { subscriptionId } = req.params;
        console.log("subid=", subscriptionId);

        const userId = req.user._id;
        // Verify subscription belongs to user
        const subscriptionRecord = await Subscription.findOne({ razorpaySubscriptionId: subscriptionId, userId });

        if (!subscriptionRecord) {
            return res.status(404).json({ error: "Subscription not found for this user" });
        }

        // Resume subscription on Razorpay
        const resumedSubscription = await razor.subscriptions.resume(subscriptionId, {
            resume_at: "immediate",
            reason: "User requested resume"
        });
        console.log("resume sub result =", resumedSubscription);

        if (!resumedSubscription) {
            return res.status(404).json({ error: "Subscription not found or could not be resumed" });
        }


        return res.status(200).json({ message: "Subscription resumed successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to resume subscription" });
    }
};


// cancle subscription
export const cancelSubscription = async (req, res) => {
    try {
        const { subscriptionId } = req.params;
        console.log("subid=", subscriptionId);
        const userId = req.user._id;

        // Verify subscription belongs to user
        const subscriptionRecord = await Subscription.findOne({ razorpaySubscriptionId: subscriptionId, userId, status: "active" });
        if (!subscriptionRecord) {
            return res.status(404).json({ error: "Subscription not found for this user" });
        }

        await Subscription.findOneAndUpdate(
            { userId, razorpaySubscriptionId: subscriptionId },
            {
                status: "cancelled",
                cancel: { cancelledAt: new Date(), cancelAtPeriodEnd: true },
                $push: {
                    logs: {
                        action: "cancelled",
                        by: "user",
                        at: new Date(),
                        note: "User requested cancellation (will end at period end)"
                    }
                }
            },
            { new: true }
        );

        // send cancellation mail to user
        await sendSubscriptionMail({
            type: "CANCELLED",
            user: await User.findById(subscriptionRecord.userId),
            meta: {
                endDate: new Date(subscriptionRecord.currentEnd).toDateString()
            }
        });


        // notification 
        await createNotification({
            userId: subscriptionRecord.userId,
            type: "subscription",
            title: "Subscription cancelled",
            message: "Your subscription has been cancelled and will remain active until the end of the current billing cycle.",
            meta: { subscriptionId }
        });


        return res.status(200).json({
            message: "Subscription will be cancelled at end of billing cycle"
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to cancel subscription" });
    }
};