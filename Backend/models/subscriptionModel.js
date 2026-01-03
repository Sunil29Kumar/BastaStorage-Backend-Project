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
                "failed"
            ],
            default: "created",
        },

        // Dates
        startAt: { type: Date },
        currentStart: { type: Date },
        currentEnd: { type: Date },
        chargeAt: { type: Date },

        // Grace period
        grace: {
            enabled: { type: Boolean, default: false },
            until: { type: Date }
        },

        // Logs
        logs: [
            {
                action: {
                    type: String,
                    enum: [
                        "created",
                        "activated",
                        "paused",
                        "resumed",
                        "cancelled",
                        "expired",
                        "grace_started",
                        "downgraded",
                        "upgraded",
                        "grace_ended_cleanup_done",
                        "payment_failed",
                    ]
                },
                at: { type: Date, default: Date.now },
                by: {
                    type: String,
                    enum: ["user", "system", "webhook"],
                    default: "system"
                },
                note: { type: String }
            }
        ],
        // Billing
        billing: {
            totalCount: { type: Number },
            paidCount: { type: Number },
            remainingCount: { type: Number },
            currentCycle: { type: Number },
            quantity: { type: Number },
        },

        // Notes
        notes: { type: Object },

        // Payment fields
        payment: {
            paymentId: { type: String },
            paymentStatus: { type: String },
            paymentMethod: { type: String },
            paymentAmount: { type: Number },
            paymentFee: { type: Number },
            paymentCurrency: { type: String },
        },

        orderId: { type: String },
        invoiceIds: [{ type: String }],

        // Pause
        pauseAt: [{ type: Date }],

        // Resume
        resumeAt: [{ type: Date }],

        // Cancel
        cancel: {
            cancelledAt: { type: Date },
            cancelAtPeriodEnd: { type: Boolean },
            endedAt: { type: Date },
        },

    },
    {
        timestamps: true,
        strict: false,   // IMPORTANT
    }
);

const Subscription = mongoose.model("Subscriptions", subscriptionSchema);
export default Subscription;
