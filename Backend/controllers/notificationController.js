import Notification from "../models/notificationModel.js"


export const fetchNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user._id }).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, notifications });
    } catch (error) {

        return res.status(500).json({ success: false, message: "Failed to fetch notifications" });
    }
}


export const markNotificationAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id;
        await Notification.findOneAndUpdate(
            { _id: notificationId, userId: req.user._id },
            { $set: { read: true } }
        );
        return res.status(200).json({ success: true, message: "Notification marked as read" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to mark notification as read" });
    }
}


export const markNotificationAllRead = async (req, res) => {
    try {
        await Notification.updateMany({ userId: req.user._id }, { $set: { read: true } });
        
        return res.status(200).json({ success: true, message: "All Notifications marked as read" });
    } catch (error) {
        return res.status(500).json({ success: false, message: "Failed to mark all notifications as read" });
    }
}