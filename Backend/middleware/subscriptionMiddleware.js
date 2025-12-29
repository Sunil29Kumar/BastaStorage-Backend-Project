import Subscription from "../models/subscriptionModel.js";

export const blockIfPaused = async (req, res, next) => {
    const userId = req.user._id;
    const subscription = await Subscription.findOne({ userId });
    if (subscription?.status === "paused") {
        return res.status(403).json({
            error: "Your subscription is paused. Only viewing and downloading are allowed.",
        });
    }
    next();
};
