import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
    {
        razorpaySubscriptionId: { type: String, required: true },
        planId: {
            type: String,
            required: true
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true
        },
        status: {
            type: String,
            enum: ["active", "cancelled", "completed", "pending", "expired", "paused", "initiated", "failed", "created",],
            default: "created"
        },
    },
    {
        timestamps: true,
        strict: "throw"
    }
)

const Subscription = mongoose.model("Subscriptions", subscriptionSchema);

export default Subscription;