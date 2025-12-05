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
        console.log("Invalid signature:", received_signature, expected_signature);
        return res.status(400).json({ message: "Invalid signature" });
    }

    console.log("payload =>", req.body.payload);



    // Handle the webhook event
    if (req.body.event === "subscription.activated") {
        console.log("webhook active payload => ", req.body.payload);

        const subscription = req.body.payload.subscription.entity;
        const payment = req.body.payload.payment.entity;
        const planId = subscription.plan_id;

        // update subscription status in DB
        const subscriptionUpdate = await Subscription.findOneAndUpdate(
            { razorpaySubscriptionId: subscription.id },
            {
                // MAIN subscription fields
                status: subscription.status,
                planId: subscription.plan_id,
                customerId: subscription.customer_id,
                customerEmail: subscription.customer_email || payment.email,
                customerContact: subscription.customer_contact || payment.contact,

                startAt: new Date(subscription.start_at * 1000),
                endAt: new Date(subscription.end_at * 1000),
                currentStart: new Date(subscription.current_start * 1000),
                currentEnd: new Date(subscription.current_end * 1000),
                chargeAt: new Date(subscription.charge_at * 1000),

                totalCount: subscription.total_count,
                paidCount: subscription.paid_count,
                remainingCount: subscription.remaining_count,
                quantity: subscription.quantity,

                notes: subscription.notes,

                // PAYMENT DETAILS
                paymentId: payment.id,
                paymentStatus: payment.status,
                paymentMethod: payment.method,
                paymentAmount: payment.amount / 100,    // convert paisa → rupees
                paymentFee: payment.fee,
                paymentCurrency: payment.currency,

                cardId: payment.card_id,
                tokenId: payment.token_id,
                orderId: payment.order_id,
                invoiceId: payment.invoice_id,

                // RAW PAYLOAD (for debugging)
                rawSubscriptionPayload: subscription,
                rawPaymentPayload: payment,
            },
            { new: true }
        );



        // update user's total space based on plan
        const storageQuotaBytes = plans[planId].storageQuotaBytes;
        await User.findByIdAndUpdate(subscriptionUpdate.userId, { totalSpace: storageQuotaBytes });

        console.log("subscription activated");



    }
    else if (req.body.event === "subscription.paused") {

        const subscription = req.body.payload.subscription.entity;

        // Update subscription status in the database
        const updatedSubscription = await Subscription.findOneAndUpdate(
            { razorpaySubscriptionId: subscription.id },
            { status: "paused" },
            { new: true }
        );
        console.log("webhook paused payload => ", req.body.payload);
    }

    else if (req.body.event === "subscription.resumed") {

        const subscription = req.body.payload.subscription.entity;
        // Update subscription status in the database
        const updatedSubscription = await Subscription.findOneAndUpdate(
            { razorpaySubscriptionId: subscription.id },
            { status: "active" },
            { new: true }
        );
        console.log("webhook resumed payload => ", req.body.payload);
    }


    return res.status(200).json({ message: "Webhook received successfully" });

}

