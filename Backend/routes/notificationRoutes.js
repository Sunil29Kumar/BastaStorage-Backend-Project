import express from "express";
import checkAuth from "../middleware/authMiddleware.js";
import { fetchNotifications, markNotificationAllRead, markNotificationAsRead } from "../controllers/notificationController.js";


const router = express.Router();


// fetch notifications
router.get("/", checkAuth, fetchNotifications)

// mark Notification as read
router.post("/mark-read/:id", checkAuth, markNotificationAsRead)

// make Notification as Read all 
router.post("/mark-read-all", checkAuth, markNotificationAllRead)


export default router;