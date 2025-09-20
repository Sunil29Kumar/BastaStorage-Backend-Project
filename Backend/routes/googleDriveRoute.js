
import express from "express";
import { sendGoogleDriveFile } from "../controllers/googleDriveController.js";
import checkAuth from "../middleware/authMiddleware.js";

const router = express.Router();

// upload google drive files
router.post("/file/:parentDirId?", checkAuth, sendGoogleDriveFile);

export default router;