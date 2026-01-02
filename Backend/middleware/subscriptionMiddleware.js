import Subscription from "../models/subscriptionModel.js";

export const blockIfPaused = async (req, res, next) => {
    const userId = req.user._id;
    const subscription = req.subscription;
    if (subscription?.status === "paused") {
        return res.status(403).json({
            error: "Your subscription is paused. Only viewing and downloading are allowed.",
        });
    }
    next();
};

export const blockIfExpired = async (req, res, next) => {
    const userId = req.user._id;
    const subscription = req.subscription;
    if (subscription?.status !== "expired") return next();

    if (subscription?.grace?.enabled) return next();

    if (subscription?.status === "expired") {
        return res.status(403).json({
            error: "Your subscription has expired. Please renew to access this feature.",
        });
    }
    next();
}

