import Razorpay from "razorpay";
import dotenv from "dotenv";
import Subscription from "../models/subscriptionModel.js";
import plans from "../utils/plans.js";
dotenv.config();

const razor = new Razorpay({
    key_id: process.env.RZP_KEY_ID,
    key_secret: process.env.RZP_KEY_SECRET
});


export const createSubscription = async (req, res) => {
    try {
        const { planId } = req.body;

        // fetch plan 
        const plan = await razor.plans.fetch(planId);
        if (!plan) {
            return res.status(404).json({ error: "Plan not found" });
        }

        const totalCount = plan.period === 'monthly' ? 1 : 12;

        // Create subscription on Razorpay
        const subscription = await razor.subscriptions.create({
            plan_id: planId,
            total_count: totalCount,
            notes: {
                userId: req.user._id.toString()
            }
        });


        // Save subscription details to the database
        const newSubscription = new Subscription({
            razorpaySubscriptionId: subscription.id,
            planId: planId,
            userId: req.user._id
        });

        await newSubscription.save();

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
        const subscription = await Subscription.findOne({ userId: req.user._id });
        if (!subscription) {
            return res.status(404).json({ error: "No subscription found for this user" });
        }
        return res.status(200).json({ subscription });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to fetch current subscription" });
    }
};


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
        if (!resumedSubscription) {
            return res.status(404).json({ error: "Subscription not found or could not be resumed" });
        }


        return res.status(200).json({ message: "Subscription resumed successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to resume subscription" });
    }
};