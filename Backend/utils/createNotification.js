// utils/createNotification.js
import Notification from "../models/notificationModel.js";

export const createNotification = async ({ userId, title, message, type = "system", meta = {} }) => {
    await Notification.create({
        userId,
        title,
        message,
        type,
        meta
    });
};
