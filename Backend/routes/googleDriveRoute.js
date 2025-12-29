
import express from "express";
import { sendGoogleDriveFile } from "../controllers/googleDriveController.js";
import checkAuth from "../middleware/authMiddleware.js";
import { blockIfPaused } from "../middleware/subscriptionMiddleware.js";


const router = express.Router();

// upload google drive files
router.post("/file/:parentDirId?", checkAuth, blockIfPaused, sendGoogleDriveFile);

export default router;