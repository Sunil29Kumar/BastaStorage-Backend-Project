import Razorpay from "razorpay";
import dotenv from "dotenv";
import Subscription from "../models/subscriptionModel.js";
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
            notes:{
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

        return res.status(200).json({
            subscriptionId: subscription.id,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: "Failed to create subscription" });
    }
};
