
import express from "express";
import { sendGoogleDriveFile } from "../controllers/googleDriveController.js";

const router = express.Router();    

// upload google drive files 
router.post("/file", sendGoogleDriveFile)

export default router;