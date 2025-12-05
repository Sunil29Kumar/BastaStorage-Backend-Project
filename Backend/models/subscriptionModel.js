import mongoose, { Schema } from "mongoose";

const subscriptionSchema = new Schema(
    {
        razorpaySubscriptionId: { type: String, required: true },
        planId: { type: String, required: true },

        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: true,
        },

        customerId: { type: String },

        status: {
            type: String,
            enum: [
                "created",
                "authenticated",
                "active",
                "paused",
                "cancelled",
                "expired",
                "pending",
                "completed",
                "failed",
            ],
            default: "created",
        },

        // Dates
        startAt: { type: Date },
        endAt: { type: Date },
        expireAt: { type: Date },
        expireBy: { type: Date },
        currentStart: { type: Date },
        currentEnd: { type: Date },
        chargeAt: { type: Date },

        // Billing
        totalCount: { type: Number },
        paidCount: { type: Number },
        remainingCount: { type: Number },
        currentCycle: { type: Number },
        quantity: { type: Number },

        // Pause
        pauseAt: { type: Date },
        resumeAt: { type: Date },
        pauseReason: { type: String },

        // Cancel
        cancelAt: { type: Date },
        cancelReason: { type: String },
        cancelledBy: { type: String },

        // Notes
        notes: { type: Object },

        // Payloads
        rawSubscriptionPayload: { type: Object },
        rawPaymentPayload: { type: Object },

        // Payment fields
        paymentId: { type: String },
        paymentStatus: { type: String },
        paymentMethod: { type: String },
        paymentAmount: { type: Number },
        paymentFee: { type: Number },
        paymentCurrency: { type: String },

        orderId: { type: String },
        invoiceId: { type: String },
        tokenId: { type: String },
        cardId: { type: String },
    },
    {
        timestamps: true,
        strict: false,   // IMPORTANT
    }
);

const Subscription = mongoose.model("Subscriptions", subscriptionSchema);
export default Subscription;
