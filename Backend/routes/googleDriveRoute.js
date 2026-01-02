
import express from "express";
import { sendGoogleDriveFile } from "../controllers/googleDriveController.js";
import checkAuth from "../middleware/authMiddleware.js";
import { blockIfExpired, blockIfPaused } from "../middleware/subscriptionMiddleware.js";


const router = express.Router();

// upload google drive files
router.post("/file/:parentDirId?", checkAuth, blockIfExpired, blockIfPaused, sendGoogleDriveFile);

export default router;