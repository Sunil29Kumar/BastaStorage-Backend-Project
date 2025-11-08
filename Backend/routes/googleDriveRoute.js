
import express from "express";
import { sendGoogleDriveFile } from "../controllers/googleDriveController.js";
import checkAuth from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadGDriveFile.js";

const router = express.Router();

// upload google drive files
router.post("/file/:parentDirId?", checkAuth, upload.single("file"), sendGoogleDriveFile);

export default router;